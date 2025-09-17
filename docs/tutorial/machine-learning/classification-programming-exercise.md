---
license: Apache-2.0
---

# 分类：编程练习

> [!INFO] Copyright 2023 Google LLC.
> 
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
> https://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.

> [!INFO] 
> 原文件在 Google Colab 的 [`binary_classification_rice.ipynb`](https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/binary_classification_rice.ipynb)。
> 由 <Icon icon="simple-icons:googlegemini"/>Gemini 2.5 Pro 翻译，请对内容进行甄别。

在这个 Colab 中，您将完成以下任务：
- 检查一个包含从两种土耳其大米图像中提取的测量值的数据集。
- 创建一个二元分类器，将米粒分为两个品种。
- 评估模型的性能。

## 学习目标

通过完成此 Colab，您将学习：
- 如何训练一个二元分类器。
- 如何计算二元分类器在不同阈值下的指标。
- 如何比较两个不同模型的 AUC 和 ROC。

## 数据集

此 Colab 使用 Cinar 和 Koklu 2019 年的 Osmancik 和 Cammeo 大米数据集。

该数据集在 CC0 许可下提供（更多文档请参见 [Kaggle](https://www.kaggle.com/datasets/muratkokludataset/rice-dataset-commeo-and-osmancik)；长度和面积单位为像素）。Cinar 和 Koklu 还在他们的 [代码库](https://www.muratkoklu.com/datasets/) 中提供了用于多类别（5 种大米）、开心果、葡萄干、葡萄叶等的数据集。

### 引用

Cinar, I. and Koklu, M., (2019). “Classification of Rice Varieties Using Artificial Intelligence Methods.” *International Journal of Intelligent Systems and Applications in Engineering*, 7(3), 188-194.

DOI: https://doi.org/10.18201/ijisae.2019355381

# 加载导入项

```python
# @title 安装所需库

!pip install google-ml-edu==0.1.2 \
    keras~=3.8.0 \
    matplotlib~=3.10.0 \
    numpy~=2.0.0 \
    pandas~=2.2.0 \
    tensorflow~=2.18.0

print('\n\n所有依赖库均已成功安装。')
```

```python
# @title 加载导入项

import keras
import ml_edu.experiment
import ml_edu.results
import numpy as np
import pandas as pd
import plotly.express as px

# 以下代码行调整报告的粒度。
pd.options.display.max_rows = 10
pd.options.display.float_format = "{:.1f}".format

print("已运行导入语句。")
```

```python
# @title 加载数据集
rice_dataset_raw = pd.read_csv("https://download.mlcc.google.com/mledu-datasets/Rice_Cammeo_Osmancik.csv")
```

通过上面的单元格加载数据集后，选择特定的列以显示数据集中数值特征的摘要统计信息。

有关每个特征的含义以及它们是如何计算的解释，请参阅 Kaggle 的[数据集文档](https://www.kaggle.com/datasets/muratkokludataset/rice-dataset-commeo-and-osmancik)，特别是 **Provenance** 部分。

```python
# @title
# 读取并提供数据集的统计信息。
rice_dataset = rice_dataset_raw[[
    'Area',
    'Perimeter',
    'Major_Axis_Length',
    'Minor_Axis_Length',
    'Eccentricity',
    'Convex_Area',
    'Extent',
    'Class',
]]

rice_dataset.describe()
```

## 任务 1：描述数据

根据上面的摘要统计信息，回答以下问题：
- 米粒的最小和最大长度（主轴长度，单位为像素）是多少？
- 最小和最大米粒之间的面积范围是多少？
- 最大米粒的周长与平均值相差多少个标准差（`std`）？

```python
# @title 解决方案（运行单元格以获取答案）

print(
    f'最短的米粒长度为 {rice_dataset.Major_Axis_Length.min():.1f}px，'
    f'而最长的为 {rice_dataset.Major_Axis_Length.max():.1f}px。'
)
print(
    f'最小的米粒面积为 {rice_dataset.Area.min()}px，而'
    f'最大的面积为 {rice_dataset.Area.max()}px。'
)
print(
    '最大的米粒，其周长为'
    f' {rice_dataset.Perimeter.max():.1f}px，'
    f' 与平均值 ({rice_dataset.Perimeter.mean():.1f}px) 相差'
    f' 约 {(rice_dataset.Perimeter.max() - rice_dataset.Perimeter.mean())/rice_dataset.Perimeter.std():.1f} 个标准差'
    f' ({rice_dataset.Perimeter.std():.1f})。'
)
print(
    f'计算方式为：({rice_dataset.Perimeter.max():.1f} -'
    f' {rice_dataset.Perimeter.mean():.1f})/{rice_dataset.Perimeter.std():.1f} ='
    f' {(rice_dataset.Perimeter.max() - rice_dataset.Perimeter.mean())/rice_dataset.Perimeter.std():.1f}'
)
```

# 探索数据集

绘制一些特征之间的关系图，包括 3D 图。

```python
# 创建五个特征之间相互对比的二维图，按类别进行颜色编码。
for x_axis_data, y_axis_data in [
    ('Area', 'Eccentricity'),
    ('Convex_Area', 'Perimeter'),
    ('Major_Axis_Length', 'Minor_Axis_Length'),
    ('Perimeter', 'Extent'),
    ('Eccentricity', 'Major_Axis_Length'),
]:
  px.scatter(rice_dataset, x=x_axis_data, y=y_axis_data, color='Class').show()
```

## 任务 2：3D 可视化样本

尝试将三个特征在 3D 空间中相互绘制。

```python
#@title 输入特征名称并运行此单元格，以 3D 形式绘制三个特征

x_axis_data = '在此处输入特征名称'  # 这里需要你在 Colab 中手动填入特征名称
y_axis_data = '在此处输入特征名称'  # 这里需要你在 Colab 中手动填入特征名称
z_axis_data = '在此处输入特征名称'  # 这里需要你在 Colab 中手动填入特征名称

px.scatter_3d(
    rice_dataset,
    x=x_axis_data,
    y=y_axis_data,
    z=z_axis_data,
    color='Class',
).show()
```

```python
# @title 一种可能的解决方案

# 绘制主轴长度、短轴长度和离心率，观察值
# 按类别进行颜色编码。
px.scatter_3d(
    rice_dataset,
    x='Eccentricity',
    y='Area',
    z='Major_Axis_Length',
    color='Class',
).show()
```

如果我们选择三个特征，看起来主轴长度、面积和离心率可能包含了区分这两个类别的大部分信息。其他组合也可能有效。

如果您还没有运行过，请运行前面的代码单元格来绘制这三个特征的图。

在这三个特征构成的平面中，似乎出现了一个清晰的类别边界。我们将仅使用这些特征训练一个模型，然后再用全部特征训练另一个模型，并比较它们的性能。

## 归一化数据

当创建一个包含多个特征的模型时，每个特征的值范围应大致相同。如果一个特征的值范围从 500 到 100,000，而另一个特征的值范围从 2 到 12，模型将需要极低或极高的权重才能有效地组合这些特征。这可能导致模型质量低下。为避免这种情况，需要对多特征模型中的特征进行[归一化](https://developers.google.com/machine-learning/glossary/#normalization)。

这可以通过将每个原始值转换为其 Z-score 来实现。给定值的 **Z-score** 是该值与平均值相差的标准差数量。

考虑一个平均值为 60，标准差为 10 的特征。

原始值 75 的 Z-score 为 +1.5：
```
  Z-score = (75 - 60) / 10 = +1.5
```

原始值 38 的 Z-score 为 -2.2：
```
  Z-score = (38 - 60) / 10 = -2.2
```
现在，通过将大米数据集中的数值转换为 Z-score 来对其进行归一化。

```python
# 计算原始数据中每个数值列的 Z-score，并
# 将它们写入一个名为 df_norm 的新 DataFrame 中。

feature_mean = rice_dataset.mean(numeric_only=True)
feature_std = rice_dataset.std(numeric_only=True)
numerical_features = rice_dataset.select_dtypes('number').columns
normalized_dataset = (
    rice_dataset[numerical_features] - feature_mean
) / feature_std

# 将类别复制到新的 dataframe
normalized_dataset['Class'] = rice_dataset['Class']

# 检查归一化训练集的一些值。注意，大多数
# Z-score 都落在 -2 和 +2 之间。
normalized_dataset.head()
```

# 设置随机种子

为了使实验可复现，我们设置了随机数生成器的种子。这意味着每次运行 colab 时，数据的打乱顺序、随机权重初始化的值等都将是相同的。

```python
keras.utils.set_random_seed(42)
```

## 标注和拆分数据

为了训练模型，我们将任意地将 Cammeo 品种的标签指定为 '1'，将 Osmancik 品种的标签指定为 '0'。

```python
# 创建一个将 Cammeo 标签设为 '1'，Osmancik 标签设为 '0' 的列，
# 然后显示 10 个随机选择的行。
normalized_dataset['Class_Bool'] = (
    # 如果类别是 Cammeo 则返回 true，如果是 Osmancik 则返回 false
    normalized_dataset['Class'] == 'Cammeo'
).astype(int)
normalized_dataset.sample(10)
```

然后，我们可以将数据集随机化并划分为训练集、验证集和测试集，分别占数据集的 80%、10% 和 10%。

我们将使用训练数据来学习模型参数，然后使用验证数据来评估不同的模型，最后使用测试数据来计算在验证数据上表现最好的模型的最终指标。

```python
# 在第 80 和第 90 百分位数创建索引
number_samples = len(normalized_dataset)
index_80th = round(number_samples * 0.8)
index_90th = index_80th + round(number_samples * 0.1)

# 随机打乱顺序并以 0.8、0.1、0.1 的比例拆分为训练集、验证集和测试集
shuffled_dataset = normalized_dataset.sample(frac=1, random_state=100)
train_data = shuffled_dataset.iloc[0:index_80th]
validation_data = shuffled_dataset.iloc[index_80th:index_90th]
test_data = shuffled_dataset.iloc[index_90th:]

# 显示最后一次拆分的前五行
test_data.head()
```

在训练过程中，防止模型将标签作为输入非常重要，这被称为标签泄漏。可以通过将特征和标签存储为单独的变量来做到这一点。

```python
label_columns = ['Class', 'Class_Bool']

train_features = train_data.drop(columns=label_columns)
train_labels = train_data['Class_Bool'].to_numpy()
validation_features = validation_data.drop(columns=label_columns)
validation_labels = validation_data['Class_Bool'].to_numpy()
test_features = test_data.drop(columns=label_columns)
test_labels = test_data['Class_Bool'].to_numpy()
```

## 训练模型

### 选择输入特征

首先，我们将使用 `Eccentricity`、`Major_Axis_Length` 和 `Area` 来训练一个模型。

```python
# 我们将用来训练模型的特征名称。
input_features = [
    'Eccentricity',
    'Major_Axis_Length',
    'Area',
]
```

## 定义构建和训练模型的函数

下面的代码单元格定义了两个函数：

*   `create_model(inputs, learning_rate, metrics)`，它定义了模型的架构。
*   `train_model(model, dataset, epochs, label_name, batch_size, shuffle)`，使用输入特征和标签来训练模型。

注意：`create_model` 应用 sigmoid 函数来执行[逻辑回归](https://developers.google.com/machine-learning/crash-course/logistic-regression)。

我们还定义了两个有用的数据结构：`ExperimentSettings` 和 `Experiment`。我们使用这些简单的类来跟踪我们的实验，从而知道使用了哪些超参数以及结果是什么。在 `ExperimentSettings` 中，我们存储描述一个实验的所有值（即超参数）。然后，我们将一次训练运行的结果（即模型和训练指标）以及用于该实验的 `ExperimentSettings` 存储到一个 `Experiment` 实例中。

```python
# @title 定义创建和训练模型的函数。


def create_model(
    settings: ml_edu.experiment.ExperimentSettings,
    metrics: list[keras.metrics.Metric],
) -> keras.Model:
  """创建并编译一个简单的分类模型。"""
  model_inputs = [
      keras.Input(name=feature, shape=(1,))
      for feature in settings.input_features
  ]
  # 使用 Concatenate 层将不同的输入组合成一个单一的
  # 张量，该张量将作为 Dense 层的输入。
  # 例如：[input_1[0][0], input_2[0][0]]

  concatenated_inputs = keras.layers.Concatenate()(model_inputs)
  model_output = keras.layers.Dense(
      units=1, name='dense_layer', activation=keras.activations.sigmoid
  )(concatenated_inputs)
  model = keras.Model(inputs=model_inputs, outputs=model_output)
  # 调用 compile 方法将层转换为 Keras
  # 可以执行的模型。注意，我们在这里使用的损失函数
  # 与回归问题不同。
  model.compile(
      optimizer=keras.optimizers.RMSprop(
          settings.learning_rate
      ),
      loss=keras.losses.BinaryCrossentropy(),
      metrics=metrics,
  )
  return model


def train_model(
    experiment_name: str,
    model: keras.Model,
    dataset: pd.DataFrame,
    labels: np.ndarray,
    settings: ml_edu.experiment.ExperimentSettings,
) -> ml_edu.experiment.Experiment:
  """将数据集输入模型以进行训练。"""

  # keras.Model.fit 的 x 参数可以是一个数组列表，
  # 其中每个数组包含一个特征的数据。
  features = {
      feature_name: np.array(dataset[feature_name])
      for feature_name in settings.input_features
  }

  history = model.fit(
      x=features,
      y=labels,
      batch_size=settings.batch_size,
      epochs=settings.number_epochs,
  )

  return ml_edu.experiment.Experiment(
      name=experiment_name,
      settings=settings,
      model=model,
      epochs=history.epoch,
      metrics_history=pd.DataFrame(history.history),
  )


print('已定义 create_model 和 train_model 函数。')
```

## 定义一个绘图函数

下面的 [matplotlib](https://developers.google.com/machine-learning/glossary/#matplotlib) 函数绘制一条或多条曲线，显示各种分类指标随每个 epoch 的变化情况。

## 调用创建、训练和绘图函数

下面的代码指定了超参数，调用函数来创建和训练模型，然后绘制结果，包括准确率、精确率和召回率。

分类阈值设置为 0.35。尝试调整阈值，然后是学习率，看看会发生什么变化。

```python
# 让我们定义我们的第一个实验设置。
settings = ml_edu.experiment.ExperimentSettings(
    learning_rate=0.001,
    number_epochs=60,
    batch_size=100,
    classification_threshold=0.35,
    input_features=input_features,
)

metrics = [
    keras.metrics.BinaryAccuracy(
        name='accuracy', threshold=settings.classification_threshold
    ),
    keras.metrics.Precision(
        name='precision', thresholds=settings.classification_threshold
    ),
    keras.metrics.Recall(
        name='recall', thresholds=settings.classification_threshold
    ),
    keras.metrics.AUC(num_thresholds=100, name='auc'),
]

# 建立模型的拓扑结构。
model = create_model(settings, metrics)

# 在训练集上训练模型。
experiment = train_model(
    'baseline', model, train_features, train_labels, settings
)

# 绘制指标与 epoch 的关系图
ml_edu.results.plot_experiment_metrics(experiment, ['accuracy', 'precision', 'recall'])
ml_edu.results.plot_experiment_metrics(experiment, ['auc'])
```

AUC 是在所有可能的阈值（在上面的代码中实际上是 100 个阈值）上计算的，而准确率、精确率和召回率仅针对指定的阈值计算。因此，它们在上面是分开显示的。

## 对照验证集评估模型

在模型训练结束时，您得到了一个针对*训练集*的特定准确率。调用下面的代码单元格来确定您的模型针对*验证集*的准确率。

```python
def compare_train_validation(experiment: ml_edu.experiment.Experiment, validation_metrics: dict[str, float]):
  print('比较训练集和验证集的指标：')
  for metric, validation_value in validation_metrics.items():
    print('------')
    print(f'训练集 {metric}: {experiment.get_final_metric_value(metric):.4f}')
    print(f'验证集 {metric}:  {validation_value:.4f}')


# 评估验证指标
validation_metrics = experiment.evaluate(validation_features, validation_labels)
compare_train_validation(experiment, validation_metrics)
```

看起来，在训练数据上达到约 92% 准确率的模型，在验证数据上仍然显示出约 90% 的准确率。我们能做得更好吗？让我们使用所有七个可用特征训练一个模型，并比较 AUC。

```python
# 用于训练模型的特征。
# 指定所有特征。
all_input_features = [
  'Eccentricity',
  'Major_Axis_Length',
  'Minor_Axis_Length',
  ? # 你的代码在这里
]
```

```python
#@title 解决方案
# 用于训练模型的特征。
# 指定所有特征。
all_input_features = [
  'Eccentricity',
  'Major_Axis_Length',
  'Minor_Axis_Length',
  'Area',
  'Convex_Area',
  'Perimeter',
  'Extent',
]
```

## 训练全特征模型并计算指标

```python
settings_all_features = ml_edu.experiment.ExperimentSettings(
    learning_rate=0.001,
    number_epochs=60,
    batch_size=100,
    classification_threshold=0.5,
    input_features=all_input_features,
)

# 修改下面 METRICS 的定义，
# 不仅生成准确率和精确率，还要生成召回率：
metrics = [
    keras.metrics.BinaryAccuracy(
        name='accuracy',
        threshold=settings_all_features.classification_threshold,
    ),
    keras.metrics.Precision(
        name='precision',
        thresholds=settings_all_features.classification_threshold,
    ),
    keras.metrics.Recall(
        name='recall', thresholds=settings_all_features.classification_threshold
    ),
    keras.metrics.AUC(num_thresholds=100, name='auc'),
]

# 建立模型的拓扑结构。
model_all_features = create_model(settings_all_features, metrics)

# 在训练集上训练模型。
experiment_all_features = train_model(
    'all features',
    model_all_features,
    train_features,
    train_labels,
    settings_all_features,
)

# 绘制指标与 epoch 的关系图
ml_edu.results.plot_experiment_metrics(
    experiment_all_features, ['accuracy', 'precision', 'recall']
)
ml_edu.results.plot_experiment_metrics(experiment_all_features, ['auc'])
```

## 在验证集上评估全特征模型

```python
validation_metrics_all_features = experiment_all_features.evaluate(
    validation_features,
    validation_labels,
)
compare_train_validation(experiment_all_features, validation_metrics_all_features)
```

这第二个模型的训练和验证指标更接近，表明它对训练数据的过拟合程度较低。

# 比较我们的两个模型

通过我们简单的实验框架，我们可以跟踪我们运行了哪些实验，以及结果如何。我们还定义了一个辅助函数，使我们能够轻松地比较两个或多个模型，无论是在训练期间还是在验证集上评估时。

```python
ml_edu.results.compare_experiment([experiment, experiment_all_features],
                                  ['accuracy', 'auc'],
                                  validation_features, validation_labels)
```

比较这两个模型，它们的 AUC 都在 0.97-0.98 左右。在添加了其他四个特征后，模型质量似乎没有大的提升，这是有道理的，因为许多特征（例如面积、周长和凸包面积）是相互关联的。

# 计算最终的测试指标

为了估计我们的模型在未见过的数据上的性能，我们现在可以在测试数据上计算最佳模型的指标。这个最后一步必须在实验结束并且我们已经选定了要使用的模型之后进行。任何模型比较都必须使用验证集来完成，以避免意外地选择了一个为我们的测试集量身定制的模型。

这最后一步也是检查潜在过拟合的机会：如果验证和测试指标非常不同，这可能是一个迹象，表明使用验证集进行的选择过程导致了一个泛化能力不佳的模型，可能是因为验证集不能代表整体数据分布。在这种情况下，最好的解决方案是重新打乱数据并重新分配训练、验证和测试集，然后再重新运行你的实验。

```python
test_metrics_all_features = experiment_all_features.evaluate(
    test_features,
    test_labels,
)
for metric, test_value in test_metrics_all_features.items():
  print(f'测试集 {metric}:  {test_value:.4f}')
```

在这种情况下，我们看到测试准确率约为 92%，这与我们上面获得的验证准确率相近。这意味着我们的模型在新的、未见过的数据上也应该表现得同样好！
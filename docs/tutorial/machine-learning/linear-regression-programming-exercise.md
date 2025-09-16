---
license: Apache-2.0
---

# 线性回归：编程练习

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
> 原文件在 Google Colab 的 [`linear_regression_taxi.ipynb`](https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/linear_regression_taxi.ipynb)。
> 由 <Icon icon="simple-icons:googlegemini"/>Gemini 2.5 Pro 翻译，请对内容进行甄别。

在这个 Colab 中，您将使用一个真实的数据集来训练一个模型，用以预测伊利诺伊州芝加哥市的出租车行程费用。

## 学习目标
完成此 Colab 后，您将能够：

*   将 .csv 文件读入 [pandas](https://developers.google.com/machine-learning/glossary/#pandas) DataFrame。
*   使用 Python 可视化库探索[数据集](https://developers.google.com/machine-learning/glossary/#data_set)。
*   试验不同的[特征](https://developers.google.com/machine-learning/glossary/#feature)来构建线性回归模型。
*   调整模型的[超参数](https://developers.google.com/machine-learning/glossary/#hyperparameter)。
*   使用[均方根误差](https://developers.google.com/machine-learning/glossary/#root-mean-squared-error-rmse)和[损失曲线](https://developers.google.com/machine-learning/glossary/#loss-curve)比较训练运行。

## 数据集描述
[本练习的数据集](https://storage.mtls.cloud.google.com/mlcc-nextgen-internal/chicago_taxi_train.csv)源自[芝加哥市出租车行程数据集](https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew)。本练习的数据是该出租车行程数据的子集，重点关注 2022 年 5 月的两天时间。

## 第 1 部分 - 练习设置

---

### 加载所需模块

本练习依赖于几个 Python 库来帮助进行数据处理、机器学习任务和数据可视化。

**操作说明**
1.  运行 **安装所需库** 代码单元（下方）。
2.  运行 **加载依赖项** 代码单元（下方）。

```python
#@title 安装所需库

!pip install google-ml-edu==0.1.3 \
  keras~=3.8.0 \
  matplotlib~=3.10.0 \
  numpy~=2.0.0 \
  pandas~=2.2.0 \
  tensorflow~=2.18.0

print('\n\n所有依赖库均已成功安装。')
```

```python
#@title 代码 - 加载依赖项

# 数据处理
import numpy as np
import pandas as pd

# 机器学习
import keras
import ml_edu.experiment
import ml_edu.results

# 数据可视化
import plotly.express as px
```

### 加载数据集


以下代码单元将加载数据集并创建一个 pandas DataFrame。

您可以将 DataFrame 想象成一个带有行和列的电子表格。行代表单个数据样本，列代表与每个样本相关的属性。

```python
# @title
chicago_taxi_dataset = pd.read_csv("https://download.mlcc.google.com/mledu-datasets/chicago_taxi_train.csv")
```

### 更新 DataFrame

以下代码单元将更新 DataFrame，使其仅使用数据集中的特定列。

请注意，输出只显示了数据集的一个样本，但应该有足够的信息让您识别与数据集相关的特征，并查看一些样本的实际数据。

```python
#@title 代码 - 读取数据集

# 更新 dataframe 以使用特定列。
training_df = chicago_taxi_dataset.loc[:, ('TRIP_MILES', 'TRIP_SECONDS', 'FARE', 'COMPANY', 'PAYMENT_TYPE', 'TIP_RATE')]

print('数据集读取成功。')
print('总行数: {0}\n\n'.format(len(training_df.index)))
training_df.head(200)
```

## 第 2 部分 - 数据集探索

---

### 查看数据集统计信息

大多数机器学习项目的一个重要部分是了解您的数据。在这一步中，您将使用 `DataFrame.describe` 方法查看关于数据集的描述性统计信息，并回答一些关于数据的重要问题。

**操作说明**
1.  运行 **查看数据集统计信息** 代码单元。
2.  检查输出并回答以下问题：
    *   最高车费是多少？
    *   所有行程的平均距离是多少？
    *   数据集中有多少家出租车公司？
    *   最常见的支付方式是什么？
    *   是否有任何特征存在数据缺失？
3.  运行 **查看数据集统计信息的答案** 代码单元以核对您的答案。

您可能想知道为什么输出中会有一组 `NaN` (非数字) 值。在 Python 中处理数据时，如果计算结果无法计算或信息缺失，您可能会看到这个值。例如，在出租车数据集中，`PAYMENT_TYPE` 和 `COMPANY` 是非数字的分类特征；诸如平均值和最大值之类的数字信息对于分类特征没有意义，因此输出显示 `NaN`。

```python
#@title 代码 - 查看数据集统计信息

print('总行数: {0}\n\n'.format(len(training_df.index)))
training_df.describe(include='all')
```

```python
#@title 双击或运行以查看关于数据集统计信息的答案

answer = '''
最高车费是多少？                                         答案：$159.25
所有行程的平均距离是多少？                       答案：8.2895 英里
数据集中有多少家出租车公司？                         答案：31
最常见的支付方式是什么？                             答案：Credit Card
是否有任何特征存在数据缺失？                             答案：否
'''

# 您应该能够通过检查运行 DataFrame describe 方法后的表格输出来找到有关数据集问题的答案。
#
# 运行此代码单元以验证您的答案。

# 最高车费是多少？
max_fare = training_df['FARE'].max()
print("最高车费是多少？\t\t\t\t答案：${fare:.2f}".format(fare = max_fare))

# 所有行程的平均距离是多少？
mean_distance = training_df['TRIP_MILES'].mean()
print("所有行程的平均距离是多少？\t\t答案：{mean:.4f} 英里".format(mean = mean_distance))

# 数据集中有多少家出租车公司？
num_unique_companies =  training_df['COMPANY'].nunique()
print("数据集中有多少家出租车公司？\t\t答案：{number}".format(number = num_unique_companies))

# 最常见的支付方式是什么？
most_freq_payment_type = training_df['PAYMENT_TYPE'].value_counts().idxmax()
print("最常见的支付方式是什么？\t\t答案：{type}".format(type = most_freq_payment_type))

# 是否有任何特征存在数据缺失？
missing_values = training_df.isnull().sum().sum()
print("是否有任何特征存在数据缺失？\t\t\t\t答案：", "否" if missing_values == 0 else "是")
```

### 生成相关性矩阵

机器学习的一个重要部分是确定哪些[特征](https://developers.google.com/machine-learning/glossary/#feature)与[标签](https://developers.google.com/machine-learning/glossary/#label)相关。如果您以前坐过出租车，您的经验可能会告诉您，车费通常与行驶距离和行程时长有关。但是，有没有办法让您更深入地了解这些特征与车费（标签）的相关性有多好呢？

在这一步中，您将使用**相关性矩阵**来识别其值与标签相关性很好的特征。相关性值具有以下含义：

*   **`1.0`**：完全正相关；也就是说，当一个属性上升时，另一个属性也上升。
*   **`-1.0`**：完全负相关；也就是说，当一个属性上升时，另一个属性下降。
*   **`0.0`**：无相关性；这两列[没有线性关系](https://en.wikipedia.org/wiki/Correlation_and_dependence#/media/File:Correlation_examples2.svg)。

一般来说，相关性值的绝对值越高，其预测能力就越强。

**操作说明**

1.  检查 **查看相关性矩阵** 代码单元中的代码。
2.  运行 **查看相关性矩阵** 代码单元并检查输出。
3.  通过回答以下问题来 **检验您的理解**：
    *   哪个特征与标签 FARE 的相关性最强？
    *   哪个特征与标签 FARE 的相关性最弱？

```python
#@title 代码 - 查看相关性矩阵
training_df.corr(numeric_only = True)
```

```python
#@title 双击查看关于相关性矩阵的答案

# 哪个特征与标签 FARE 的相关性最强？
# ---------------------------------------------------------
answer = '''
与 FARE 相关性最强的特征是 TRIP_MILES。
正如您可能预期的那样，TRIP_MILES 看起来是开始训练模型的一个很好的特征。
另外，请注意 TRIP_SECONDS 特征也与车费有很强的相关性。
'''
print(answer)


# 哪个特征与标签 FARE 的相关性最弱？
# -----------------------------------------------------------
answer = '''与 FARE 相关性最弱的特征是 TIP_RATE。'''
print(answer)
```

### 可视化数据集中的关系

有时，将数据集中特征之间的关系可视化会很有帮助；一种方法是使用配对图。**配对图**会生成一个成对图的网格，以便在一个地方可视化每个特征与所有其他特征的关系。

**操作说明**
1.  运行 **查看配对图** 代码单元。

```python
#@title 代码 - 查看配对图
px.scatter_matrix(training_df, dimensions=["FARE", "TRIP_MILES", "TRIP_SECONDS"])
```

## 第 3 部分 - 训练模型

---

### 定义用于构建和训练模型的函数

构建和训练模型所需的核心代码位于 **定义机器学习函数** 代码单元中。如果您想探索这段代码，可以展开代码单元查看。

**操作说明**
1.  运行 **定义机器学习函数** 代码单元。

```python
#@title 代码 - 定义机器学习函数

def create_model(
    settings: ml_edu.experiment.ExperimentSettings,
    metrics: list[keras.metrics.Metric],
) -> keras.Model:
  """创建并编译一个简单的线性回归模型。"""
  # 描述模型的拓扑结构。
  # 一个简单线性回归模型的拓扑结构是
  # 单个层中的单个节点。
  inputs = {name: keras.Input(shape=(1,), name=name) for name in settings.input_features}
  concatenated_inputs = keras.layers.Concatenate()(list(inputs.values()))
  outputs = keras.layers.Dense(units=1)(concatenated_inputs)
  model = keras.Model(inputs=inputs, outputs=outputs)

  # 将模型拓扑编译成 Keras 可以高效执行的代码。
  # 配置训练以最小化模型的均方误差。
  model.compile(optimizer=keras.optimizers.RMSprop(learning_rate=settings.learning_rate),
                loss="mean_squared_error",
                metrics=metrics)

  return model


def train_model(
    experiment_name: str,
    model: keras.Model,
    dataset: pd.DataFrame,
    label_name: str,
    settings: ml_edu.experiment.ExperimentSettings,
) -> ml_edu.experiment.Experiment:
  """通过向模型提供数据来训练模型。"""

  # 向模型提供特征和标签。
  # 模型将按指定的周期数进行训练。
  features = {name: dataset[name].values for name in settings.input_features}
  label = dataset[label_name].values
  history = model.fit(x=features,
                      y=label,
                      batch_size=settings.batch_size,
                      epochs=settings.number_epochs)

  return ml_edu.experiment.Experiment(
      name=experiment_name,
      settings=settings,
      model=model,
      epochs=history.epoch,
      metrics_history=pd.DataFrame(history.history),
  )

print("成功：定义线性回归函数已完成。")
```

### 使用单个特征训练模型

在这一步中，您将训练一个使用**单个特征**来预测车费成本的模型。之前，您看到 `TRIP_MILES`（距离）与 `FARE` 的相关性最强，所以让我们从 `TRIP_MILES` 作为第一次训练运行的特征开始。

**操作说明**

1.  运行 **实验 1** 代码单元，以构建您的单特征模型。
2.  回顾训练运行的输出。
3.  通过回答以下问题来 **检验您的理解**：
    *   模型收敛到最终状态需要多少个周期（epoch）？
    *   模型对样本数据的拟合程度如何？

在训练期间，您应该会在输出中看到均方根误差 (RMSE)。RMSE 的单位与标签的单位（美元）相同。换句话说，您可以使用 RMSE 来确定预测的车费与观测值平均相差多少美元。

```python
#@title 代码 - 实验 1

# 以下变量是超参数。
settings_1 = ml_edu.experiment.ExperimentSettings(
    learning_rate = 0.001,
    number_epochs = 20,
    batch_size = 50,
    input_features = ['TRIP_MILES']
)

metrics = [keras.metrics.RootMeanSquaredError(name='rmse')]

model_1 = create_model(settings_1, metrics)

experiment_1 = train_model('one_feature', model_1, training_df, 'FARE', settings_1)

ml_edu.results.plot_experiment_metrics(experiment_1, ['rmse'])
ml_edu.results.plot_model_predictions(experiment_1, training_df, 'FARE')
```

```python
#@title 双击查看使用单特征训练模型的答案

# 模型收敛到最终状态需要多少个周期（epoch）？
# -----------------------------------------------------------------------------
answer = """
使用损失曲线来观察训练过程中损失开始趋于平稳的位置。

对于这组超参数：

  learning_rate = 0.001
  epochs = 20
  batch_size = 50

训练运行大约需要 5 个周期才能收敛到最终模型。
"""
print(answer)

# 模型对样本数据的拟合程度如何？
# -----------------------------------------------------------------------------
answer = '''
从模型图中看，该模型对样本数据的拟合相当好。
'''
print(answer)
```

### 试验超参数

在机器学习中，通常会运行多次实验来找到训练模型的最佳超参数集。在这一步中，请尝试通过以下实验逐个改变超参数：

*   *实验 1:* **增加** 学习率至 **`1`** (批量大小为 `50`)。
*   *实验 2:* **减小** 学习率至 **`0.0001`** (批量大小为 `50`)。
*   *实验 3:* **增加** 批量大小至 **`500`** (学习率为 `0.001`)。

**操作说明**
1.  根据实验要求更新 **实验 2** 代码单元中的超参数值。
2.  运行 **实验 2** 代码单元。
3.  训练运行后，检查输出并注意您在损失曲线或模型输出中看到的任何差异。
4.  对每个超参数实验重复步骤 1 - 3。
5.  通过回答以下问题来 **检验您的理解**：
    *   提高学习率对您训练模型的能力有何影响？
    *   降低学习率对您训练模型的能力有何影响？
    *   改变批量大小是否影响了您的训练结果？

```python
#@title 代码 - 实验 2

# 以下变量是超参数。
# TODO - 调整这些超参数，观察它们如何影响训练运行。
settings_2 = ml_edu.experiment.ExperimentSettings(
    learning_rate = 0.001,
    number_epochs = 20,
    batch_size = 50,
    input_features = ['TRIP_MILES']
)

metrics = [keras.metrics.RootMeanSquaredError(name='rmse')]

model_2 = create_model(settings_2, metrics)

experiment_2 = train_model('one_feature_hyper', model_2, training_df, 'FARE', settings_2)

ml_edu.results.plot_experiment_metrics(experiment_2, ['rmse'])
ml_edu.results.plot_model_predictions(experiment_2, training_df, 'FARE')
```

```python
#@title 双击查看超参数实验的答案

# 提高学习率对您训练模型的能力有何影响？
# -----------------------------------------------------------------------------
answer = """
当学习率过高时，损失曲线会上下波动，并且似乎没有在每次迭代中都向收敛方向移动。
此外，请注意预测的模型与数据的拟合效果不佳。
学习率过高，您不太可能训练出效果好的模型。
"""
print(answer)

# 降低学习率对您训练模型的能力有何影响？
# -----------------------------------------------------------------------------
answer = '''
当学习率过小时，损失曲线可能需要更长的时间才能收敛。
学习率小，损失曲线下降缓慢，但没有显示出急剧下降或趋于平稳的迹象。
使用较小的学习率，您可以增加周期数，使您的模型最终收敛，但这将花费更长的时间。
'''
print(answer)

# 改变批量大小是否影响了您的训练结果？
# -----------------------------------------------------------------------------
answer = '''
增加批量大小可以使每个周期运行得更快，但与较小的学习率一样，
模型在仅 20 个周期内并未收敛。如果您有时间，
可以尝试增加周期数，最终您应该会看到模型收敛。
'''
print(answer)
```

### 使用两个特征训练模型

您使用特征 `TOTAL_MILES` 训练的模型展示了相当强的预测能力，但有没有可能做得更好？在这一步中，尝试使用 `TRIP_MILES` 和 `TRIP_MINUTES` 两个特征来训练模型，看看是否可以改进模型。您可能还记得，原始数据集中不包含 `TRIP_MINUTES` 特征，但这个特征可以很容易地从 `TRIP_SECONDS` 派生出来，如下面的代码所示。

**操作说明**
1.  回顾 **实验 3** 代码单元中的代码。
2.  运行 **实验 3** 代码单元。
3.  回顾训练运行的输出并回答以下问题：
    *   使用两个特征的模型是否比使用单个特征的模型产生更好的结果？
    *   使用 `TRIP_SECONDS` 代替 `TRIP_MINUTES` 会有区别吗？
    *   您认为该模型与芝加哥出租车行程的真实计价方式有多接近？


请注意，特征与标签的散点图是一个三维（3D）图。这种表示方式让您可以同时可视化两个特征和标签。两个特征（TRIP_MILES 和 TRIP_MINUTES）分别在 x 轴和 y 轴上，标签（FARE）在 z 轴上。该图将数据集中的单个样本显示为圆圈，将模型显示为一个平面。对于这个 3D 模型，如果训练好的模型是好的，您会期望大多数样本都落在平面上。这个 3D 图是交互式的，您可以通过点击或拖动图表来进一步探索数据。

```python
#@title 代码 - 实验 3

# 以下变量是超参数。
settings_3 = ml_edu.experiment.ExperimentSettings(
    learning_rate = 0.001,
    number_epochs = 20,
    batch_size = 50,
    input_features = ['TRIP_MILES', 'TRIP_MINUTES']
)

training_df['TRIP_MINUTES'] = training_df['TRIP_SECONDS']/60

metrics = [keras.metrics.RootMeanSquaredError(name='rmse')]

model_3 = create_model(settings_3, metrics)

experiment_3 = train_model('two_features', model_3, training_df, 'FARE', settings_3)

ml_edu.results.plot_experiment_metrics(experiment_3, ['rmse'])
ml_edu.results.plot_model_predictions(experiment_3, training_df, 'FARE')
```

```python
#@title 双击查看使用两个特征训练的答案

# 使用两个特征的模型是否比使用单个特征的模型产生更好的结果？
# -----------------------------------------------------------------------------
answer = '''
要回答您特定训练运行的这个问题，请比较每个模型的 RMSE。
例如，如果使用单个特征训练的模型的 RMSE 是 3.7457，而使用两个特征的模型的 RMSE 是 3.4787，
这意味着平均而言，使用两个特征的模型做出的预测比观察到的车费要近约 $0.27。
'''
print(answer)

# 使用 TRIP_SECONDS 代替 TRIP_MINUTES 会有区别吗？
# -----------------------------------------------------------------------------
answer = '''
当使用多个特征训练模型时，重要的是所有数值大致在相同的尺度上。
在这种情况下，TRIP_SECONDS 和 TRIP_MILES 不符合这个标准。
TRIP_MILES 的平均值是 8.3，而 TRIP_SECONDS 的平均值是 1,320；这相差了两个数量级。
相比之下，TRIP_MINUTES 的平均值是 22，这与 TRIP_MILES (8.3) 的尺度比 TRIP_SECONDS (1,320) 更相似。
当然，这并不是在训练前缩放数值的唯一方法，您将在另一个模块中学到相关知识。
'''
print(answer)

# 您认为该模型与芝加哥出租车行程的真实计价方式有多接近？
# -----------------------------------------------------------------------------
answer = '''
实际上，芝加哥出租车使用一个有记录的公式来确定车费。
对于一个支付现金的单身乘客，车费计算如下：

FARE = 2.25 * TRIP_MILES + 0.12 * TRIP_MINUTES + 3.25

通常在机器学习问题中，您不会知道“正确”的公式，但在这种情况下，
您可以利用这些知识来评估您的模型。
看一下您的模型输出（权重和偏置），并确定它与真实计价方式的匹配程度。
您应该会发现模型大致接近这个公式。
'''
print(answer)
```

### 比较实验

```python
ml_edu.results.compare_experiment([experiment_1, experiment_3], ['rmse'], training_df, training_df['FARE'].values)
```

## 第 4 部分 - 验证模型

---

### 使用模型进行预测

现在您有了一个训练好的模型，您可以用它来进行预测。在实践中，您应该对训练期间未使用过的样本进行预测。然而，在本练习中，您将只使用同一训练数据集的一个子集。在另一个 Colab 练习中，您将探索对训练中未使用的样本进行预测的方法。

**操作说明**

1.  运行 **定义用于预测的函数** 代码单元。
2.  运行 **进行预测** 代码单元。
3.  回顾输出中的预测结果。
4.  通过回答以下问题来 **检验您的理解**：
    *   预测值与标签值有多接近？换句话说，您的模型能准确预测出租车行程的车费吗？

```python
#@title 代码 - 定义用于预测的函数
def format_currency(x):
  return "${:.2f}".format(x)

def build_batch(df, batch_size):
  batch = df.sample(n=batch_size).copy()
  batch.set_index(np.arange(batch_size), inplace=True)
  return batch

def predict_fare(model, df, features, label, batch_size=50):
  batch = build_batch(df, batch_size)
  predicted_values = model.predict_on_batch(x={name: batch[name].values for name in features})

  data = {"PREDICTED_FARE": [], "OBSERVED_FARE": [], "L1_LOSS": [],
          features[0]: [], features[1]: []}
  for i in range(batch_size):
    predicted = predicted_values[i][0]
    observed = batch.at[i, label]
    data["PREDICTED_FARE"].append(format_currency(predicted))
    data["OBSERVED_FARE"].append(format_currency(observed))
    data["L1_LOSS"].append(format_currency(abs(observed - predicted)))
    data[features[0]].append(batch.at[i, features[0]])
    data[features[1]].append("{:.2f}".format(batch.at[i, features[1]]))

  output_df = pd.DataFrame(data)
  return output_df

def show_predictions(output):
  header = "-" * 80
  banner = header + "\n" + "|" + "PREDICTIONS".center(78) + "|" + "\n" + header
  print(banner)
  print(output)
  return
```

```python
#@title 代码 - 进行预测

output = predict_fare(experiment_3.model, training_df, experiment_3.settings.input_features, 'FARE')
show_predictions(output)
```

```python
#@title 双击查看验证模型的答案

# 预测值与标签值有多接近？
# -----------------------------------------------------------------------------
answer = '''
根据对样本的随机抽样，该模型在预测出租车行程车费方面似乎做得相当不错。
大多数预测值与观测值没有显著差异。
您应该能通过查看 L1_LOSS = |观测值 - 预测值| 这一列来看到这一点。
'''
print(answer)
```
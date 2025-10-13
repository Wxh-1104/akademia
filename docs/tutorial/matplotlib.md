---
license: CC-BY-NC-SA-4.0
---

# Matplotlib 快速入门指南

> [!INFO] 
> 原文为 [Quick start guide](https://matplotlib.org/stable/users/explain/quick_start.html#quick-start-guide)。对应版本 `3.10.7(stable)`。
> 由 <Icon icon="simple-icons:googlegemini"/>Gemini 2.5 Pro 翻译，请对内容进行甄别。

本教程涵盖了一些基本的用法和最佳实践，以帮助你开始使用 Matplotlib。

```python
import matplotlib.pyplot as plt
import numpy as np
```

## 一个简单的例子

Matplotlib 在 [ `Figure` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.html#matplotlib.figure.Figure)（例如，窗口、Jupyter 小部件等）上绘制你的数据，每个 Figure 都可以包含一个或多个 [ `Axes` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html#matplotlib.axes.Axes)（一个可以根据 x-y 坐标指定点（或极坐标图中的 theta-r，3D 图中的 x-y-z 等）的区域）。创建一个带有 Axes 的 Figure 最简单的方法是使用 [ `pyplot.subplots` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html#matplotlib.pyplot.subplots)。然后我们可以使用 [ `Axes.plot` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html#matplotlib.axes.Axes.plot) 在 Axes 上绘制一些数据，并使用 [ `show` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.show.html#matplotlib.pyplot.show) 来显示图形：

```python
fig, ax = plt.subplots()  # 创建一个包含单个 Axes 的 Figure。
ax.plot([1, 2, 3, 4], [1, 4, 2, 3])  # 在 Axes 上绘制一些数据。
plt.show()  # 显示 Figure。
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_001.png)

根据你所工作的环境，`plt.show()` 可能会被省略。例如，在 Jupyter notebooks 中就是这种情况，它会自动显示在一个代码单元格中创建的所有 Figure。

## Figure 的组成部分

以下是 Matplotlib Figure 的各个组件。

![anatomy](https://matplotlib.org/stable/_images/anatomy.png)

### [ `Figure` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.html#matplotlib.figure.Figure)

**整个**图形。Figure 会跟踪所有的子 [ `Axes` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html#matplotlib.axes.Axes)、一组“特殊”的 Artist（标题、图例、颜色条等），甚至是嵌套的子图。

通常，你会通过以下函数之一来创建一个新的 Figure：

```python
fig = plt.figure()  # 一个没有任何 Axes 的空 Figure
fig, ax = plt.subplots()  # 一个带单个 Axes 的 Figure
fig, axs = plt.subplots(2, 2)  # 一个带有 2x2 网格 Axes 的 Figure
# 一个左侧有一个 Axes，右侧有两个 Axes 的 Figure：
fig, axs = plt.subplot_mosaic([['left', 'right_top'],
                               ['left', 'right_bottom']])
```

[ `subplots()` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html#matplotlib.pyplot.subplots) 和 [ `subplot_mosaic` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html#matplotlib.pyplot.subplot_mosaic) 是便捷函数，它们在 Figure 内部额外创建了 Axes 对象，但你也可以稍后手动添加 Axes。

关于 Figure 的更多信息，包括平移和缩放，请参阅 [Figure 简介](https://matplotlib.org/stable/users/explain/figure/figure_intro.html#figure-intro)。

### [ `Axes` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html#matplotlib.axes.Axes)

一个 Axes 是附加到 Figure 上的 Artist，它包含一个用于绘制数据的区域，并且通常包括两个（对于 3D 情况是三个）[ `Axis` ](https://matplotlib.org/stable/api/axis_api.html#matplotlib.axis.Axis) 对象（请注意 **Axes** 和 **Axis** 的区别），这些对象提供刻度和刻度标签，为 Axes 中的数据提供刻度。每个 [ `Axes` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html#matplotlib.axes.Axes) 还有一个标题（通过 [ `set_title()` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html#matplotlib.axes.Axes.set_title) 设置）、一个 x 轴标签（通过 [ `set_xlabel()` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlabel.html#matplotlib.axes.Axes.set_xlabel) 设置）和一个 y 轴标签（通过 [ `set_ylabel()` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_ylabel.html#matplotlib.axes.Axes.set_ylabel) 设置）。

[ `Axes` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html#matplotlib.axes.Axes) 的方法是用于配置绘图大部分内容（添加数据、控制坐标轴刻度和范围、添加标签等）的主要接口。

### [ `Axis` ](https://matplotlib.org/stable/api/axis_api.html#matplotlib.axis.Axis)

这些对象设置刻度和范围，并生成刻度（Axis 上的标记）和刻度标签（标记刻度的字符串）。刻度的位置由一个 [ `Locator` ](https://matplotlib.org/stable/api/ticker_api.html#matplotlib.ticker.Locator) 对象确定，刻度标签字符串由一个 [ `Formatter` ](https://matplotlib.org/stable/api/ticker_api.html#matplotlib.ticker.Formatter) 格式化。正确地组合 [ `Locator` ](https://matplotlib.org/stable/api/ticker_api.html#matplotlib.ticker.Locator) 和 [ `Formatter` ](https://matplotlib.org/stable/api/ticker_api.html#matplotlib.ticker.Formatter) 可以对刻度位置和标签进行非常精细的控制。

### [ `Artist` ](https://matplotlib.org/stable/api/artist_api.html#matplotlib.artist.Artist)

基本上，Figure 上所有可见的东西都是一个 Artist（甚至 [ `Figure` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.html#matplotlib.figure.Figure)、[ `Axes` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html#matplotlib.axes.Axes) 和 [ `Axis` ](https://matplotlib.org/stable/api/axis_api.html#matplotlib.axis.Axis) 对象）。这包括 [ `Text` ](https://matplotlib.org/stable/api/text_api.html#matplotlib.text.Text) 对象、[ `Line2D` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.lines.Line2D.html#matplotlib.lines.Line2D) 对象、[ `collections` ](https://matplotlib.org/stable/api/collections_api.html#module-matplotlib.collections) 对象、[ `Patch` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.patches.Patch.html#matplotlib.patches.Patch) 对象等。当 Figure 被渲染时，所有的 Artist 都会被绘制到**画布**上。大多数 Artist 都与一个 Axes 相关联；这样的 Artist 不能被多个 Axes 共享，也不能从一个移动到另一个。

## 绘图函数的输入类型

绘图函数期望接收 [ `numpy.array` ](https://numpy.org/doc/stable/reference/generated/numpy.array.html#numpy.array) 或 [ `numpy.ma.masked_array` ](https://numpy.org/doc/stable/reference/generated/numpy.ma.masked_array.html#numpy.ma.masked_array) 作为输入，或者可以传递给 [ `numpy.asarray` ](https://numpy.org/doc/stable/reference/generated/numpy.asarray.html#numpy.asarray) 的对象。与数组相似的类（“array-like”），例如 [ `pandas` ](https://pandas.pydata.org/pandas-docs/stable/index.html#module-pandas) 数据对象和 [ `numpy.matrix` ](https://numpy.org/doc/stable/reference/generated/numpy.matrix.html#numpy.matrix) 可能不会按预期工作。通常的惯例是在绘图前将这些对象转换为 [ `numpy.array` ](https://numpy.org/doc/stable/reference/generated/numpy.array.html#numpy.array) 对象。例如，要转换一个 [ `numpy.matrix` ](https://numpy.org/doc/stable/reference/generated/numpy.matrix.html#numpy.matrix)：

```python
b = np.matrix([[1, 2], [3, 4]])
b_asarray = np.asarray(b)
```

大多数方法还会解析可使用字符串索引的对象，如 *dict*、[结构化 numpy 数组](https://numpy.org/doc/stable/user/basics.rec.html#structured-arrays#noqa:E501) 或 [ `pandas.DataFrame` ](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame)。Matplotlib 允许你提供 `data` 关键字参数，并通过传递与 *x* 和 *y* 变量对应的字符串来生成图表。

```python
np.random.seed(19680801)  # 为随机数生成器设定种子。
data = {'a': np.arange(50),
        'c': np.random.randint(0, 50, 50),
        'd': np.random.randn(50)}
data['b'] = data['a'] + 10 * np.random.randn(50)
data['d'] = np.abs(data['d']) * 100

fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
ax.scatter('a', 'b', c='c', s='d', data=data)
ax.set_xlabel('entry a')
ax.set_ylabel('entry b')```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_002.png)

## 编码风格

### 显式和隐式接口

如上所述，使用 Matplotlib 基本上有两种方式：

*   显式地创建 Figure 和 Axes，并调用它们的方法（“面向对象（OO）风格”）。
*   依赖 pyplot 隐式地创建和管理 Figure 和 Axes，并使用 pyplot 函数进行绘图。

关于隐式和显式接口之间的权衡，请参阅 [Matplotlib 应用接口 (APIs)](https://matplotlib.org/stable/users/explain/figure/api_interfaces.html#api-interfaces)。

所以，你可以使用 OO 风格：

```python
x = np.linspace(0, 2, 100)  # 示例数据。

# 注意，即使在 OO 风格中，我们仍然使用 `.pyplot.figure` 来创建 Figure。
fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
ax.plot(x, x, label='linear')  # 在 Axes 上绘制一些数据。
ax.plot(x, x**2, label='quadratic')  # 在 Axes 上绘制更多数据...
ax.plot(x, x**3, label='cubic')  # ...以及更多。
ax.set_xlabel('x label')  # 为 Axes 添加 x 轴标签。
ax.set_ylabel('y label')  # 为 Axes 添加 y 轴标签。
ax.set_title("Simple Plot")  # 为 Axes 添加标题。
ax.legend()  # 添加图例。
```

![Simple Plot](https://matplotlib.org/stable/_images/sphx_glr_quick_start_003.png)

或者 pyplot 风格：

```python
x = np.linspace(0, 2, 100)  # 示例数据。

plt.figure(figsize=(5, 2.7), layout='constrained')
plt.plot(x, x, label='linear')  # 在（隐式的）Axes 上绘制一些数据。
plt.plot(x, x**2, label='quadratic')  # 等等。
plt.plot(x, x**3, label='cubic')
plt.xlabel('x label')
plt.ylabel('y label')
plt.title("Simple Plot")
plt.legend()
```

![Simple Plot](https://matplotlib.org/stable/_images/sphx_glr_quick_start_004.png)

（此外，还有第三种方法，用于将 Matplotlib 嵌入 GUI 应用程序中，它完全不使用 pyplot，甚至不用于创建 Figure。更多信息请参见 gallery 中的相应部分：[在图形用户界面中嵌入 Matplotlib](https://matplotlib.org/stable/gallery/user_interfaces/index.html#user-interfaces)。）

Matplotlib 的文档和示例同时使用了 OO 和 pyplot 两种风格。总的来说，我们建议使用 OO 风格，特别是对于复杂的图表，以及那些打算作为大型项目一部分重用的函数和脚本。然而，对于快速的交互式工作，pyplot 风格可能非常方便。

> **注意**
>
> 你可能会发现一些使用 `pylab` 接口的旧示例，通过 `from pylab import *`。这种方法已被强烈弃用。

### 创建辅助函数

如果你需要用不同的数据集一遍又一遍地制作相同的图表，或者想要轻松地封装 Matplotlib 方法，请使用下面推荐的函数签名。

```python
def my_plotter(ax, data1, data2, param_dict):
    """
    一个用于绘制图表的辅助函数。
    """
    out = ax.plot(data1, data2, **param_dict)
    return out
```

然后你可以用它两次来填充两个子图：

```python
data1, data2, data3, data4 = np.random.randn(4, 100)  # 创建 4 个随机数据集
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(5, 2.7))
my_plotter(ax1, data1, data2, {'marker': 'x'})
my_plotter(ax2, data3, data4, {'marker': 'o'})
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_005.png)

请注意，如果你想将这些安装为 python 包，或进行任何其他自定义，你可以使用网络上的众多模板之一；Matplotlib 在 [mpl-cookiecutter](https://github.com/matplotlib/matplotlib-extension-cookiecutter) 提供了一个。

## 设置 Artist 样式

大多数绘图方法都有用于 Artist 的样式选项，可以在调用绘图方法时访问，也可以通过 Artist 的“setter”方法访问。在下面的图表中，我们手动设置了由 [ `plot` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html#matplotlib.axes.Axes.plot) 创建的 Artist 的 *color*、*linewidth* 和 *linestyle*，并且我们事后使用 [ `set_linestyle` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.lines.Line2D.html#matplotlib.lines.Line2D.set_linestyle) 设置了第二条线的线型。

```python
fig, ax = plt.subplots(figsize=(5, 2.7))
x = np.arange(len(data1))
ax.plot(x, np.cumsum(data1), color='blue', linewidth=3, linestyle='--')
l, = ax.plot(x, np.cumsum(data2), color='orange', linewidth=2)
l.set_linestyle(':')
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_006.png)

### 颜色

Matplotlib 对大多数 Artist 接受非常灵活的颜色数组；有关规范列表，请参见[允许的颜色定义](https://matplotlib.org/stable/users/explain/colors/colors.html#colors-def)。一些 Artist 可以接受多种颜色。例如，对于 [ `scatter` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html#matplotlib.axes.Axes.scatter) 图，标记的边缘颜色可以与内部颜色不同：

```python
fig, ax = plt.subplots(figsize=(5, 2.7))
ax.scatter(data1, data2, s=50, facecolor='C0', edgecolor='k')
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_007.png)

### 线宽、线型和标记大小

线宽通常以印刷点（1 pt = 1/72 英寸）为单位，并可用于具有描边线条的 Artist。类似地，描边线条可以有线型。请参阅[线型示例](https://matplotlib.org/stable/gallery/lines_bars_and_markers/linestyles.html)。

标记大小取决于所使用的方法。[ `plot` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html#matplotlib.axes.Axes.plot) 以点为单位指定标记大小，通常是标记的“直径”或宽度。[ `scatter` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html#matplotlib.axes.Axes.scatter) 指定的标记大小约与标记的视觉面积成正比。有一系列可用的标记样式作为字符串代码（参见 [ `markers` ](https://matplotlib.org/stable/api/markers_api.html#module-matplotlib.markers)），或者用户可以定义自己的 [ `MarkerStyle` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.markers.MarkerStyle.html#matplotlib.markers.MarkerStyle)（参见[标记参考](https://matplotlib.org/stable/gallery/lines_bars_and_markers/marker_reference.html)）：

```python
fig, ax = plt.subplots(figsize=(5, 2.7))
ax.plot(data1, 'o', label='data1')
ax.plot(data2, 'd', label='data2')
ax.plot(data3, 'v', label='data3')
ax.plot(data4, 's', label='data4')
ax.legend()
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_008.png)

## 标注图表

### 坐标轴标签和文本

[ `set_xlabel` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlabel.html#matplotlib.axes.Axes.set_xlabel)、[ `set_ylabel` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_ylabel.html#matplotlib.axes.Axes.set_ylabel) 和 [ `set_title` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html#matplotlib.axes.Axes.set_title) 用于在指定位置添加文本（更多讨论请参见[Matplotlib 中的文本](https://matplotlib.org/stable/users/explain/text/text_intro.html#text-intro)）。文本也可以使用 [ `text` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html#matplotlib.axes.Axes.text) 直接添加到图表中：

```python
mu, sigma = 115, 15
x = mu + sigma * np.random.randn(10000)
fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
# 数据的直方图
n, bins, patches = ax.hist(x, 50, density=True, facecolor='C0', alpha=0.75)

ax.set_xlabel('Length [cm]')
ax.set_ylabel('Probability')
ax.set_title('Aardvark lengths\n (not really)')
ax.text(75, .025, r'$\mu=115,\ \sigma=15$')
ax.axis([55, 175, 0, 0.03])
ax.grid(True)
```

![Aardvark lengths (not really)](https://matplotlib.org/stable/_images/sphx_glr_quick_start_009.png)

所有 [ `text` ](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html#matplotlib.axes.Axes.text) 函数都返回一个 [ `matplotlib.text.Text` ](https://matplotlib.org/stable/api/text_api.html#matplotlib.text.Text) 实例。就像上面的线条一样，你可以通过将关键字参数传递给文本函数来自定义属性：

```python
t = ax.set_xlabel('my data', fontsize=14, color='red')
```

这些属性在[文本属性和布局](https://matplotlib.org/stable/users/explain/text/text_props.html#text-props)中有更详细的介绍。

### 在文本中使用数学表达式

Matplotlib 在任何文本表达式中都接受 TeX 方程表达式。例如，要在标题中写入表达式 $\sigma_i=15$，你可以写一个由美元符号包围的 TeX 表达式：

```python
ax.set_title(r'$\sigma_i=15$')
```

其中，标题字符串前面的 `r` 表示该字符串是一个*原始*字符串，不要将反斜杠视为 python 转义符。Matplotlib 有一个内置的 TeX 表达式解析器和布局引擎，并附带自己的数学字体——详情请见[编写数学表达式](https://matplotlib.org/stable/users/explain/text/mathtext.html#mathtext)。你也可以直接使用 LaTeX 来格式化你的文本，并将输出直接合并到你的显示图形或保存的 postscript 中——参见[使用 LaTeX 渲染文本](https://matplotlib.org/stable/users/explain/text/usetex.html#usetex)。

### 注解

我们还可以在图表上对点进行注解，通常是通过连接一个指向 *xy* 的箭头到位于 *xytext* 的一段文本：

```python
fig, ax = plt.subplots(figsize=(5, 2.7))

t = np.arange(0.0, 5.0, 0.01)
s = np.cos(2 * np.pi * t)
line, = ax.plot(t, s, lw=2)

ax.annotate('local max', xy=(2, 1), xytext=(3, 1.5),
            arrowprops=dict(facecolor='black', shrink=0.05))

ax.set_ylim(-2, 2)
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_010.png)

在这个基本示例中，*xy* 和 *xytext* 都在数据坐标系中。可以选择多种其他坐标系——详情请参见[基本注解](https://matplotlib.org/stable/users/explain/text/annotations.html#annotations-tutorial)和[高级注解](https://matplotlib.org/stable/users/explain/text/annotations.html#plotting-guide-annotation)。更多示例也可以在[注解图表](https://matplotlib.org/stable/gallery/text_labels_and_annotations/annotation_demo.html)中找到。

### 图例

我们经常希望用 [`Axes.legend`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.legend.html#matplotlib.axes.Axes.legend) 来标识线条或标记：

```python
fig, ax = plt.subplots(figsize=(5, 2.7))
ax.plot(np.arange(len(data1)), data1, label='data1')
ax.plot(np.arange(len(data2)), data2, label='data2')
ax.plot(np.arange(len(data3)), data3, 'd', label='data3')
ax.legend()
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_011.png)

Matplotlib 中的图例在布局、位置以及它们可以代表的 Artist 方面都非常灵活。在[图例指南](https://matplotlib.org/stable/users/explain/axes/legend_guide.html#legend-guide)中有详细讨论。

## 坐标轴刻度和范围

每个 Axes 有两个（或三个）[`Axis`](https://matplotlib.org/stable/api/axis_api.html#matplotlib.axis.Axis) 对象，代表 x 轴和 y 轴。这些对象控制坐标轴的*比例*、刻度*定位器*和刻度*格式化器*。可以附加额外的 Axes 来显示更多的 Axis 对象。

### 范围

除了线性刻度，Matplotlib 还提供了非线性刻度，如对数刻度。由于对数刻度使用得非常频繁，因此也有像 [`loglog`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.loglog.html#matplotlib.axes.Axes.loglog)、[`semilogx`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.semilogx.html#matplotlib.axes.Axes.semilogx) 和 [`semilogy`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.semilogy.html#matplotlib.axes.Axes.semilogy) 这样的直接方法。还有许多其他刻度（其他示例请参见[刻度概述](https://matplotlib.org/stable/gallery/scales/scales.html)）。这里我们手动设置刻度：

```python
fig, axs = plt.subplots(1, 2, figsize=(5, 2.7), layout='constrained')
xdata = np.arange(len(data1))  # 为此创建一个序数
data = 10**data1
axs[0].plot(xdata, data)

axs[1].set_yscale('log')
axs[1].plot(xdata, data)
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_012.png)

刻度设置了从数据值到坐标轴上间距的映射。这在两个方向上都会发生，并组合成一个*变换*，这是 Matplotlib 将数据坐标映射到 Axes、Figure 或屏幕坐标的方式。请参见[变换教程](https://matplotlib.org/stable/users/explain/artists/transforms_tutorial.html#transforms-tutorial)。

### 刻度定位器和格式化器

每个 Axis 都有一个刻度*定位器*和*格式化器*，用于选择在 Axis 对象上放置刻度线的位置。一个简单的接口是 [`set_xticks`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xticks.html#matplotlib.axes.Axes.set_xticks)：

```python
fig, axs = plt.subplots(2, 1, layout='constrained')
axs[0].plot(xdata, data1)
axs[0].set_title('Automatic ticks')

axs[1].plot(xdata, data1)
axs[1].set_xticks(np.arange(0, 100, 30), ['zero', '30', 'sixty', '90'])
axs[1].set_yticks([-1.5, 0, 1.5])  # 注意我们不需要指定标签
axs[1].set_title('Manual ticks')
```

![Automatic ticks, Manual ticks](https://matplotlib.org/stable/_images/sphx_glr_quick_start_013.png)

不同的刻度可以有不同的定位器和格式化器；例如，上面的对数刻度使用 [`LogLocator`](https://matplotlib.org/stable/api/ticker_api.html#matplotlib.ticker.LogLocator) 和 [`LogFormatter`](https://matplotlib.org/stable/api/ticker_api.html#matplotlib.ticker.LogFormatter)。有关其他格式化器和定位器以及编写自己的信息，请参见[刻度定位器](https://matplotlib.org/stable/gallery/ticks/tick-locators.html)和[刻度格式化器](https://matplotlib.org/stable/gallery/ticks/tick-formatters.html)。

### 绘制日期和字符串

Matplotlib 可以处理日期数组和字符串数组的绘制，以及浮点数。这些会根据情况获得特殊的定位器和格式化器。对于日期：

```python
from matplotlib.dates import ConciseDateFormatter

fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
dates = np.arange(np.datetime64('2021-11-15'), np.datetime64('2021-12-25'),
                  np.timedelta64(1, 'h'))
data = np.cumsum(np.random.randn(len(dates)))
ax.plot(dates, data)
ax.xaxis.set_major_formatter(ConciseDateFormatter(ax.xaxis.get_major_locator()))
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_014.png)

更多信息请参见日期示例（例如[日期刻度标签](https://matplotlib.org/stable/gallery/text_labels_and_annotations/date.html)）。

对于字符串，我们会得到分类绘图（参见：[绘制分类变量](https://matplotlib.org/stable/gallery/lines_bars_and_markers/categorical_variables.html)）。

```python
fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
categories = ['turnips', 'rutabaga', 'cucumber', 'pumpkins']

ax.bar(categories, np.random.rand(len(categories)))
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_015.png)

关于分类绘图的一个注意事项是，一些解析文本文件的方法会返回一个字符串列表，即使这些字符串都代表数字或日期。如果你传递 1000 个字符串，Matplotlib 会认为你指的是 1000 个类别，并会在你的图表上添加 1000 个刻度！

### 额外的坐标轴对象

在一张图表中绘制不同量级的数据可能需要一个额外的 y 轴。这样的 Axis 可以通过使用 [`twinx`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twinx.html#matplotlib.axes.Axes.twinx) 创建，它会添加一个新的 Axes，其 x 轴不可见，y 轴位于右侧（[`twiny`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twiny.html#matplotlib.axes.Axes.twiny) 类似）。另一个例子请参见[具有不同刻度的图表](https://matplotlib.org/stable/gallery/subplots_axes_and_figures/two_scales.html)。

类似地，你可以添加一个与主 Axis 具有不同刻度的 [`secondary_xaxis`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.secondary_xaxis.html#matplotlib.axes.Axes.secondary_xaxis) 或 [`secondary_yaxis`](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.secondary_yaxis.html#matplotlib.axes.Axes.secondary_yaxis)，以不同的刻度或单位表示数据。更多示例请参见[次要坐标轴](https://matplotlib.org/stable/gallery/subplots_axes_and_figures/secondary_axis.html)。

```python
fig, (ax1, ax3) = plt.subplots(1, 2, figsize=(7, 2.7), layout='constrained')
l1, = ax1.plot(t, s)
ax2 = ax1.twinx()
l2, = ax2.plot(t, range(len(t)), 'C1')
ax2.legend([l1, l2], ['Sine (left)', 'Straight (right)'])

ax3.plot(t, s)
ax3.set_xlabel('Angle [rad]')
ax4 = ax3.secondary_xaxis('top', (np.rad2deg, np.deg2rad))
ax4.set_xlabel('Angle [°]')
```

![quick start](https://matplotlib.org/stable/_images/sphx_glr_quick_start_016.png)

## 颜色映射数据

我们经常希望在图表中用颜色图中的颜色来表示第三个维度。Matplotlib 有许多可以实现这一点的绘图类型：

```python
from matplotlib.colors import LogNorm

X, Y = np.meshgrid(np.linspace(-3, 3, 128), np.linspace(-3, 3, 128))
Z = (1 - X/2 + X**5 + Y**3) * np.exp(-X**2 - Y**2)

fig, axs = plt.subplots(2, 2, layout='constrained')
pc = axs[0, 0].pcolormesh(X, Y, Z, vmin=-1, vmax=1, cmap='RdBu_r')
fig.colorbar(pc, ax=axs[0, 0])
axs[0, 0].set_title('pcolormesh()')

co = axs[0, 1].contourf(X, Y, Z, levels=np.linspace(-1.25, 1.25, 11))
fig.colorbar(co, ax=axs[0, 1])
axs[0, 1].set_title('contourf()')

pc = axs[1, 0].imshow(Z**2 * 100, cmap='plasma',
                    norm=LogNorm(vmin=0.01, vmax=100))
fig.colorbar(pc, ax=axs[1, 0], extend='both')
axs[1, 0].set_title('imshow() with LogNorm()')

pc = axs[1, 1].scatter(data1, data2, c=data3, cmap='RdBu_r')
fig.colorbar(pc, ax=axs[1, 1], extend='both')
axs[1, 1].set_title('scatter()')
```

![pcolormesh(), contourf(), imshow() with LogNorm(), scatter()](https://matplotlib.org/stable/_images/sphx_glr_quick_start_017.png)

### 颜色映射表

这些都是派生自 [`ScalarMappable`](https://matplotlib.org/stable/api/cm_api.html#matplotlib.cm.ScalarMappable) 对象的 Artist 的例子。它们都可以设置一个从 *vmin* 和 *vmax* 到由 *cmap* 指定的颜色映射表的线性映射。Matplotlib 有许多颜色映射表可供选择（[在 Matplotlib 中选择颜色映射表](https://matplotlib.org/stable/users/explain/colors/colormaps.html#colormaps)），你可以创建自己的（[在 Matplotlib 中创建颜色映射表](https://matplotlib.org/stable/users/explain/colors/colormap-manipulation.html#colormap-manipulation)）或作为[第三方包](https://matplotlib.org/mpl-third-party/#colormaps-and-styles)下载。

### 归一化

有时我们希望数据到颜色映射表的非线性映射，如上面的 `LogNorm` 示例。我们通过向 ScalarMappable 提供 *norm* 参数而不是 *vmin* 和 *vmax* 来实现这一点。更多归一化方法请参见[颜色映射表归一化](https://matplotlib.org/stable/users/explain/colors/colormapnorms.html#colormapnorms)。

### 颜色条

添加一个 [`colorbar`](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.colorbar.html#matplotlib.figure.Figure.colorbar) 可以提供一个将颜色与底层数据关联起来的键。颜色条是 Figure 级别的 Artist，它们附加到一个 ScalarMappable（从中获取有关归一化和颜色映射表的信息），并且通常会占用父 Axes 的空间。颜色条的放置可能很复杂：详情请参见[放置颜色条](https://matplotlib.org/stable/users/explain/axes/colorbar_placement.html#colorbar-placement)。你还可以使用 *extend* 关键字在末端添加箭头来改变颜色条的外观，并使用 *shrink* 和 *aspect* 来控制大小。最后，颜色条将具有适合于归一化的默认定位器和格式化器。这些可以像其他 Axis 对象一样进行更改。

## 使用多个 Figure 和 Axes

你可以通过多次调用 `fig = plt.figure()` 或 `fig2, ax = plt.subplots()` 来打开多个 Figure。通过保留对象引用，你可以向任何一个 Figure 添加 Artist。

有多种方法可以添加多个 Axes，但最基本的是上面使用的 `plt.subplots()`。使用 [`subplot_mosaic`](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html#matplotlib.pyplot.subplot_mosaic) 可以实现更复杂的布局，使 Axes 对象跨越列或行。

```python
fig, axd = plt.subplot_mosaic([['upleft', 'right'],
                               ['lowleft', 'right']], layout='constrained')
axd['upleft'].set_title('upleft')
axd['lowleft'].set_title('lowleft')
axd['right'].set_title('right')
```

![upleft, right, lowleft](https://matplotlib.org/stable/_images/sphx_glr_quick_start_018.png)

Matplotlib 拥有相当复杂的工具来排列 Axes：请参见[在一个 Figure 中排列多个 Axes](https://matplotlib.org/stable/users/explain/axes/arranging_axes.html#arranging-axes) 和[复杂和语义化的图形组合 (subplot_mosaic)](https://matplotlib.org/stable/users/explain/axes/mosaic.html#mosaic)。

## 更多阅读

更多绘图类型请参见[绘图类型](https://matplotlib.org/stable/plot_types/index.html)和[API 参考](https://matplotlib.org/stable/api/index.html)，特别是[Axes API](https://matplotlib.org/stable/api/axes_api.html)。

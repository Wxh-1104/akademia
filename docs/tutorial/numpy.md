---
license: CC-BY-NC-SA-4.0
---

# NumPy 完全入门指南

> [!INFO] 
> 原文为 [NumPy: the absolute basics for beginners](https://numpy.org/doc/stable/user/absolute_beginners.html)。
> 由 <Icon icon="simple-icons:googlegemini"/>Gemini 2.5 Pro 翻译，请对内容进行甄别。

欢迎阅读 NumPy 完全入门指南！

<Icon icon="devicon-plain:numpy" href="https://numpy.org/"/>NumPy (**Num**erical **Py**thon) 是一个开源的 Python 库，广泛用于科学和工程领域。NumPy 库包含多维数组数据结构，例如同构的 N 维 `ndarray`，以及一个庞大的、能对这些数据结构进行高效运算的函数库。在[什么是 NumPy](https://numpy.org/doc/stable/user/whatisnumpy.html#whatisnumpy) 中了解更多关于 NumPy 的信息，如果您有任何意见或建议，请[联系我们](https://numpy.org/community/)！

## 如何导入 NumPy

在[安装 NumPy](https://numpy.org/install/) 之后，可以像这样将其导入 Python 代码中：

```python
import numpy as np
```

这种广泛使用的约定允许使用一个简短且易于识别的前缀 (`np.`) 来访问 NumPy 的功能，同时将 NumPy 的功能与其他同名功能区分开来。

## 阅读示例代码

在整个 NumPy 文档中，您会看到如下所示的代码块：

```python
>>> a = np.array([[1, 2, 3],
...               [4, 5, 6]])
>>> a.shape
(2, 3)
```

以 `>>>` 或 `...` 开头的文本是**输入**，即您需要在脚本或 Python 提示符中输入的代码。其他所有内容都是**输出**，即运行代码的结果。请注意，`>>>` 和 `...` 不是代码的一部分，如果在 Python 提示符中输入它们，可能会导致错误。

要运行示例中的代码，您可以将其复制并粘贴到 Python 脚本或 REPL 中，也可以使用文档中多处提供的实验性浏览器内交互示例。

## 为什么使用 NumPy？

Python 列表是优秀的通用容器。它们可以是“异构的”，意味着它们可以包含各种类型的元素，并且当用于对少量元素执行单独操作时，它们的速度相当快。

根据数据的特性和需要执行的操作类型，其他容器可能更合适；通过利用这些特性，我们可以提高速度、减少内存消耗，并为执行各种常见处理任务提供更高级的语法。当需要在 CPU 上处理大量“同构”（相同类型）数据时，NumPy 的优势就显现出来了。

## 什么是“数组”？

在计算机编程中，数组是用于存储和检索数据的结构。我们通常把数组看作空间中的一个网格，每个单元格存储一个数据元素。例如，如果数据的每个元素都是一个数字，我们可能会将“一维”数组想象成一个列表：

$$
\begin{array}{|c||c|c|c|}
\hline
1 & 5 & 2 & 0 \\
\hline
\end{array}
$$

一个二维数组就像一张表格：

$$
\begin{array}{|c||c|c|c|}
\hline
1 & 5 & 2 & 0 \\
\hline
8 & 3 & 6 & 1 \\
\hline
1 & 7 & 2 & 9 \\
\hline
\end{array}
$$

一个三维数组就像一组表格，也许像打印在不同页面上一样堆叠起来。在 NumPy 中，这个概念被推广到任意数量的维度，因此基本的数组类被称为 `ndarray`：它代表一个“N 维数组”。

大多数 NumPy 数组都有一些限制。例如：

*   数组的所有元素必须是相同类型的数据。
*   一旦创建，数组的总大小不能改变。
*   形状必须是“矩形”的，而不是“锯齿状”的；例如，二维数组的每一行必须有相同数量的列。

当满足这些条件时，NumPy 会利用这些特性，使数组比限制较少的数据结构更快、更节省内存、使用更方便。

在本文的其余部分，我们将使用“数组”一词来指代 `ndarray` 的实例。

## 数组基础

初始化数组的一种方法是使用 Python 序列，例如列表。例如：

```python
>>> a = np.array([1, 2, 3, 4, 5, 6])
>>> a
array([1, 2, 3, 4, 5, 6])
```

数组的元素可以通过[多种方式](https://numpy.org/doc/stable/user/quickstart.html#quickstart-indexing-slicing-and-iterating)进行访问。例如，我们可以像访问原始列表中的元素一样访问该数组的单个元素：使用方括号内的整数索引。

```python
>>> a[0]
1
```

> **注意**
>
> 与 Python 内置序列一样，NumPy 数组是“0 索引”的：数组的第一个元素使用索引 `0` 访问，而不是 `1`。

与原始列表一样，该数组是可变的。

```python
>>> a[0] = 10
>>> a
array([10,  2,  3,  4,  5,  6])
```

也与原始列表一样，Python 的切片表示法可用于索引。

```python
>>> a[:3]
array([10, 2, 3])
```

一个主要区别是，对列表进行切片索引会将元素复制到一个新列表中，但对数组进行切片会返回一个*视图*：一个引用原始数组中数据的对象。可以使用视图来修改原始数组。

```python
>>> b = a[3:]
>>> b
array([4, 5, 6])
>>> b[0] = 40
>>> a
array([ 10,  2,  3, 40,  5,  6])
```

有关数组操作何时返回视图而不是副本的更全面解释，请参阅[副本与视图](https://numpy.org/doc/stable/user/basics.copies.html#basics-copies-and-views)。

二维及更高维的数组可以从嵌套的 Python 序列中初始化：

```python
>>> a = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
>>> a
array([[ 1,  2,  3,  4],
       [ 5,  6,  7,  8],
       [ 9, 10, 11, 12]])
```

在 NumPy 中，数组的一个维度有时被称为“轴”（axis）。这个术语可能有助于区分数组的维度和数组所表示数据的维度。例如，数组 `a` 可以表示三个点，每个点都位于一个四维空间中，但 `a` 只有两个“轴”。

数组和列表的列表之间的另一个区别是，可以通过在*单*组方括号内指定每个轴的索引（用逗号分隔）来访问数组的元素。例如，元素 `8` 位于第 `1` 行和第 `3` 列：

```python
>>> a[1, 3]
8
```

> **注意**
>
> 在数学中，习惯于先用行索引再用列索引来引用矩阵的元素。对于二维数组来说，这恰好是正确的，但一个更好的心智模型是，将列索引视为*最后*一个，行索引视为*倒数第二个*。这可以推广到任意维度的数组。

> **注意**
>
> 您可能听说过 0-D（零维）数组被称为“标量”（scalar），1-D（一维）数组被称为“向量”（vector），2-D（二维）数组被称为“矩阵”（matrix），或者 N-D（N 维，其中 “N” 通常是大于 2 的整数）数组被称为“张量”（tensor）。为清晰起见，在引用数组时最好避免使用这些数学术语，因为具有这些名称的数学对象的行为与数组不同（例如，“矩阵”乘法与“数组”乘法有根本的不同），而且科学 Python 生态系统中还有其他具有这些名称的对象（例如，PyTorch 的基本数据结构是“张量”）。

## 数组属性

*本节涵盖数组的 `ndim`、`shape`、`size` 和 `dtype` 属性。*

---

数组的维度数包含在 `ndim` 属性中。

```python
>>> a.ndim
2
```

数组的形状是一个非负整数的元组，指定了每个维度上的元素数量。

```python
>>> a.shape
(3, 4)
>>> len(a.shape) == a.ndim
True
```

数组中固定的元素总数包含在 `size` 属性中。

```python
>>> a.size
12
>>> import math
>>> a.size == math.prod(a.shape)
True
```

数组通常是“同构的”，意味着它们只包含一种“数据类型”的元素。数据类型记录在 `dtype` 属性中。

```python
>>> a.dtype
dtype('int64')  # "int" 代表整数，"64" 代表 64 位
```

[在此处阅读有关数组属性的更多信息](https://numpy.org/doc/stable/reference/arrays.ndarray.html#arrays-ndarray)，并[在此处了解数组对象](https://numpy.org/doc/stable/reference/arrays.html#arrays)。

## 如何创建基本数组

*本节涵盖 `np.zeros()`、`np.ones()`、`np.empty()`、`np.arange()`、`np.linspace()`*

---

除了从元素序列创建数组外，您还可以轻松创建一个填充了 `0` 的数组：

```python
>>> np.zeros(2)
array([0., 0.])
```

或者一个填充了 `1` 的数组：

```python
>>> np.ones(2)
array([1., 1.])
```

甚至是一个空数组！`empty` 函数创建一个初始内容是随机的、取决于内存状态的数组。使用 `empty` 而不是 `zeros`（或类似函数）的原因是速度——只要确保之后填充每个元素即可！

```python
>>> # 创建一个包含 2 个元素的空数组
>>> np.empty(2) 
array([3.14, 42.  ])  # 结果可能不同
```

您可以创建一个包含一系列元素的数组：

```python
>>> np.arange(4)
array([0, 1, 2, 3])
```

甚至可以创建一个包含一系列均匀间隔元素的数组。为此，您需要指定**第一个数**、**最后一个数**和**步长**。

```python
>>> np.arange(2, 9, 2)
array([2, 4, 6, 8])
```

您还可以使用 `np.linspace()` 来创建一个在指定区间内线性间隔的数组：

```python
>>> np.linspace(0, 10, num=5)
array([ 0. ,  2.5,  5. ,  7.5, 10. ])
```

**指定您的数据类型**

虽然默认的数据类型是浮点数 (`np.float64`)，但您可以使用 `dtype` 关键字明确指定所需的数据类型。

```python
>>> x = np.ones(2, dtype=np.int64)
>>> x
array([1, 1])
```

[在此处了解有关创建数组的更多信息](https://numpy.org/doc/stable/user/quickstart.html#quickstart-array-creation)

## 添加、删除和排序元素

*本节涵盖 `np.sort()`、`np.concatenate()`*

---

使用 `np.sort()` 对数组进行排序非常简单。您可以在调用该函数时指定轴、种类和顺序。

如果您从这个数组开始：

```python
>>> arr = np.array([2, 1, 5, 3, 7, 4, 6, 8])
```

您可以快速将数字按升序排序：

```python
>>> np.sort(arr)
array([1, 2, 3, 4, 5, 6, 7, 8])
```

除了返回数组已排序副本的 `sort` 之外，您还可以使用：

*   `argsort`，它是一个沿指定轴的间接排序，
*   `lexsort`，它是一个对多个键的间接稳定排序，
*   `searchsorted`，它将在已排序的数组中查找元素，以及
*   `partition`，它是一个部分排序。

要阅读有关数组排序的更多信息，请参阅：[`sort`](https://numpy.org/doc/stable/reference/generated/numpy.sort.html#numpy.sort)。

如果您从这些数组开始：

```python
>>> a = np.array([1, 2, 3, 4])
>>> b = np.array([5, 6, 7, 8])
```

您可以使用 `np.concatenate()` 将它们拼接起来。

```python
>>> np.concatenate((a, b))
array([1, 2, 3, 4, 5, 6, 7, 8])
```

或者，如果您从这些数组开始：

```python
>>> x = np.array([[1, 2], [3, 4]])
>>> y = np.array([[5, 6]])
```

您可以使用以下方式拼接它们：

```python
>>> np.concatenate((x, y), axis=0)
array([[1, 2],
       [3, 4],
       [5, 6]])
```

要从数组中删除元素，使用索引来选择您想保留的元素是很简单的。

要阅读有关拼接的更多信息，请参阅：[`concatenate`](https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html#numpy.concatenate)。

## 如何知道数组的形状和大小？

*本节涵盖 `ndarray.ndim`、`ndarray.size`、`ndarray.shape`*

---

`ndarray.ndim` 会告诉您数组的轴数或维度数。

`ndarray.size` 会告诉您数组的元素总数。这是数组形状各元素之*积*。

`ndarray.shape` 会显示一个整数元组，表示沿数组每个维度存储的元素数量。例如，如果您有一个 2 行 3 列的二维数组，那么数组的形状是 `(2, 3)`。

例如，如果您创建这个数组：

```python
>>> array_example = np.array([[[0, 1, 2, 3],
...                            [4, 5, 6, 7]],
...
...                           [[0, 1, 2, 3],
...                            [4, 5, 6, 7]],
...
...                           [[0 ,1 ,2, 3],
...                            [4, 5, 6, 7]]])
```

要查找数组的维度数，请运行：

```python
>>> array_example.ndim
3
```

要查找数组中的元素总数，请运行：

```python
>>> array_example.size
24
```

要查找数组的形状，请运行：

```python
>>> array_example.shape
(3, 2, 4)
```

## 你可以重塑一个数组吗？

*本节涵盖 `arr.reshape()`*

---

**是的！**

使用 `arr.reshape()` 会在不改变数据的情况下为数组赋予新的形状。只要记住，当您使用 `reshape` 方法时，您想要生成的数组必须具有与原始数组相同数量的元素。如果您从一个有 12 个元素的数组开始，您需要确保您的新数组也总共有 12 个元素。

如果您从这个数组开始：

```python
>>> a = np.arange(6)
>>> print(a)
[0 1 2 3 4 5]
```

您可以使用 `reshape()` 来重塑您的数组。例如，您可以将此数组重塑为一个三行两列的数组：

```python
>>> b = a.reshape(3, 2)
>>> print(b)
[[0 1]
 [2 3]
 [4 5]]
```

使用 `np.reshape`，您可以指定一些可选参数：

```python
>>> np.reshape(a, newshape=(1, 6), order='C')
array([[0, 1, 2, 3, 4, 5]])
```

`a` 是要被重塑的数组。

`shape` 是您想要的新形状。您可以指定一个整数或一个整数元组。如果指定一个整数，结果将是一个该长度的一维数组。该形状应与原始形状兼容。

`order`: `C` 表示使用类 C 的索引顺序读/写元素，`F` 表示使用类 Fortran 的索引顺序读/写元素，`A` 表示如果 a 在内存中是 Fortran 连续的，则以类 Fortran 的索引顺序读/写元素，否则以类 C 的顺序读/写。（这是一个可选参数，不必指定。）

如果您想了解更多关于 C 和 Fortran 顺序的信息，您可以[在这里阅读更多关于 NumPy 数组内部组织的信息](https://numpy.org/doc/stable/dev/internals.html#numpy-internals)。本质上，C 和 Fortran 顺序与索引如何对应于数组在内存中的存储顺序有关。在 Fortran 中，当遍历存储在内存中的二维数组元素时，**第一个**索引是变化最快的索引。当第一个索引变化时，它移动到下一行，因此矩阵是按列存储的。这就是为什么 Fortran 被认为是**列主序语言**。另一方面，在 C 中，**最后一个**索引变化最快。矩阵是按行存储的，使其成为**行主序语言**。您对 C 或 Fortran 的选择取决于更重要的是保留索引约定还是不重新排序数据。

[在此处了解有关形状操作的更多信息](https://numpy.org/doc/stable/user/quickstart.html#quickstart-shape-manipulation)。

## 如何将一维数组转换为二维数组（如何向数组添加新轴）

*本节涵盖 `np.newaxis`、`np.expand_dims`*

---

您可以使用 `np.newaxis` 和 `np.expand_dims` 来增加现有数组的维度。

使用一次 `np.newaxis` 将使您的数组维度增加一维。这意味着一个**一维**数组将变成一个**二维**数组，一个**二维**数组将变成一个**三维**数组，依此类推。

例如，如果您从这个数组开始：

```python
>>> a = np.array([1, 2, 3, 4, 5, 6])
>>> a.shape
(6,)
```

您可以使用 `np.newaxis` 添加一个新轴：

```python
>>> a2 = a[np.newaxis, :]
>>> a2.shape
(1, 6)
```

您可以使用 `np.newaxis` 将一维数组显式转换为行向量或列向量。例如，您可以通过在第一个维度上插入一个轴将一维数组转换为行向量：

```python
>>> row_vector = a[np.newaxis, :]
>>> row_vector.shape
(1, 6)
```

或者，对于列向量，您可以在第二个维度上插入一个轴：

```python
>>> col_vector = a[:, np.newaxis]
>>> col_vector.shape
(6, 1)
```

您还可以使用 `np.expand_dims` 在指定位置插入一个新轴来扩展数组。

例如，如果您从这个数组开始：

```python
>>> a = np.array([1, 2, 3, 4, 5, 6])
>>> a.shape
(6,)
```

您可以使用 `np.expand_dims` 在索引位置 1 添加一个轴：

```python
>>> b = np.expand_dims(a, axis=1)
>>> b.shape
(6, 1)
```

您可以在索引位置 0 添加一个轴：

```python
>>> c = np.expand_dims(a, axis=0)
>>> c.shape
(1, 6)
```

[在此处查找有关 newaxis 的更多信息](https://numpy.org/doc/stable/reference/routines.indexing.html#arrays-indexing)，并在[`expand_dims`](https://numpy.org/doc/stable/reference/generated/numpy.expand_dims.html#numpy.expand_dims) 处了解 `expand_dims`。

## 索引和切片

您可以像对 Python 列表进行切片一样对 NumPy 数组进行索引和切片。

```python
>>> data = np.array([1, 2, 3])

>>> data[1]
2
>>> data[0:2]
array([1, 2])
>>> data[1:]
array([2, 3])
>>> data[-2:]
array([2, 3])
```

您可以这样将其可视化：

![NumPy 数组索引和切片图示](https://numpy.org/doc/stable/user/_images/np_indexing.png)

您可能希望提取数组的一部分或特定的数组元素，以用于进一步的分析或其他操作。为此，您需要对数组进行子集划分、切片和/或索引。

如果您想从数组中选择满足特定条件的值，使用 NumPy 会很简单。

例如，如果您从这个数组开始：

```python
>>> a = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
```

您可以轻松打印出数组中小于 5 的所有值。

```python
>>> print(a[a < 5])
[1 2 3 4]
```

您还可以选择，例如，大于或等于 5 的数字，并使用该条件来索引数组。

```python
>>> five_up = (a >= 5)
>>> print(a[five_up])
[ 5  6  7  8  9 10 11 12]
```

您可以选择能被 2 整除的元素：

```python
>>> divisible_by_2 = a[a%2==0]
>>> print(divisible_by_2)
[ 2  4  6  8 10 12]
```

或者您可以使用 `&` 和 `|` 运算符选择满足两个条件的元素：

```python
>>> c = a[(a > 2) & (a < 11)]
>>> print(c)
[ 3  4  5  6  7  8  9 10]
```

您还可以利用逻辑运算符 **&** 和 **|** 返回布尔值，以指明数组中的值是否满足某个条件。这对于包含名称或其他分类值的数组可能很有用。

```python
>>> five_up = (a > 5) | (a == 5)
>>> print(five_up)
[[False False False False]
 [ True  True  True  True]
 [ True  True  True  True]]```

您还可以使用 `np.nonzero()` 从数组中选择元素或索引。

从这个数组开始：

```python
>>> a = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
```

您可以使用 `np.nonzero()` 来打印出例如小于 5 的元素的索引：

```python
>>> b = np.nonzero(a < 5)
>>> print(b)
(array([0, 0, 0, 0]), array([0, 1, 2, 3]))
```

在这个例子中，返回了一个数组的元组：每个维度一个。第一个数组表示找到这些值的行索引，第二个数组表示找到这些值的列索引。

如果您想生成元素存在的坐标列表，您可以压缩这些数组，遍历坐标列表，然后打印它们。例如：

```python
>>> list_of_coordinates= list(zip(b[0], b[1]))

>>> for coord in list_of_coordinates:
...     print(coord)
(0, 0)
(0, 1)
(0, 2)
(0, 3)
```

您也可以使用 `np.nonzero()` 来打印数组中小于 5 的元素：

```python
>>> print(a[b])
[1 2 3 4]
```

如果您要查找的元素在数组中不存在，那么返回的索引数组将是空的。例如：

```python
>>> not_there = np.nonzero(a == 42)
>>> print(not_there)
(array([], dtype=int64), array([], dtype=int64))
```

[在此处](https://numpy.org/doc/stable/user/quickstart.html#quickstart-indexing-slicing-and-iterating)和[此处](https://numpy.org/doc/stable/user/basics.indexing.html#basics-indexing)了解有关索引和切片的更多信息。

在以下位置阅读有关使用 nonzero 函数的更多信息：[`nonzero`](https://numpy.org/doc/stable/reference/generated/numpy.nonzero.html#numpy.nonzero)。

## 如何从现有数据创建数组

*本节涵盖 `切片和索引`、`np.vstack()`、`np.hstack()`、`np.hsplit()`、`.view()`、`copy()`*

---

您可以轻松地从现有数组的一部分创建新数组。

假设您有这个数组：

```python
>>> a = np.array([1,  2,  3,  4,  5,  6,  7,  8,  9, 10])
```

您可以随时通过指定要切片数组的位置来从数组的一部分创建新数组。

```python
>>> arr1 = a[3:8]
>>> arr1
array([4, 5, 6, 7, 8])
```

在这里，您抓取了从索引位置 3 到索引位置 8（但不包括位置 8 本身）的数组部分。

*提醒：数组索引从 0 开始。这意味着数组的第一个元素在索引 0，第二个元素在索引 1，依此类推。*

您还可以将两个现有数组垂直和水平地堆叠起来。假设您有两个数组，`a1` 和 `a2`：

```python
>>> a1 = np.array([[1, 1],
...                [2, 2]])

>>> a2 = np.array([[3, 3],
...                [4, 4]])
```

您可以使用 `vstack` 将它们垂直堆叠：

```python
>>> np.vstack((a1, a2))
array([[1, 1],
       [2, 2],
       [3, 3],
       [4, 4]])
```

或者使用 `hstack` 将它们水平堆叠：

```python
>>> np.hstack((a1, a2))
array([[1, 1, 3, 3],
       [2, 2, 4, 4]])
```

您可以使用 `hsplit` 将一个数组拆分成几个较小的数组。您可以指定要返回的形状相等的数组数量，或者指定应该在哪些列*之后*进行分割。

假设您有这个数组：

```python
>>> x = np.arange(1, 25).reshape(2, 12)
>>> x
array([[ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12],
       [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]])
```

如果您想将此数组拆分为三个形状相等的数组，您将运行：

```python
>>> np.hsplit(x, 3)
[array([[ 1,  2,  3,  4],
       [13, 14, 15, 16]]), array([[ 5,  6,  7,  8],
       [17, 18, 19, 20]]), array([[ 9, 10, 11, 12],
       [21, 22, 23, 24]])]
```

如果您想在第三列和第四列之后拆分数组，您将运行：

```python
>>> np.hsplit(x, (3, 4))
[array([[ 1,  2,  3],
       [13, 14, 15]]), array([[ 4],
       [16]]), array([[ 5,  6,  7,  8,  9, 10, 11, 12],
       [17, 18, 19, 20, 21, 22, 23, 24]])]
```

[在此处了解有关堆叠和拆分数组的更多信息](https://numpy.org/doc/stable/user/quickstart.html#quickstart-stacking-arrays)。

您可以使用 `view` 方法创建一个查看与原始数组相同数据的新数组对象（*浅拷贝*）。

视图是一个重要的 NumPy 概念！NumPy 函数以及像索引和切片这样的操作，会尽可能返回视图。这样可以节省内存并且速度更快（不必制作数据的副本）。然而，意识到这一点很重要——修改视图中的数据也会修改原始数组！

假设您创建了这个数组：

```python
>>> a = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
```

现在我们通过切片 `a` 创建一个数组 `b1`，并修改 `b1` 的第一个元素。这也会修改 `a` 中相应的元素！

```python
>>> b1 = a[0, :]
>>> b1
array([1, 2, 3, 4])
>>> b1[0] = 99
>>> b1
array([99,  2,  3,  4])
>>> a
array([[99,  2,  3,  4],
       [ 5,  6,  7,  8],
       [ 9, 10, 11, 12]])
```

使用 `copy` 方法将制作数组及其数据的完整副本（*深拷贝*）。要在您的数组上使用它，您可以运行：

```python
>>> b2 = a.copy()
```

[在此处了解有关副本和视图的更多信息](https://numpy.org/doc/stable/user/quickstart.html#quickstart-copies-and-views)。

## 基本数组运算

*本节涵盖加法、减法、乘法、除法等*

---

一旦您创建了数组，就可以开始使用它们了。比如说，您创建了两个数组，一个名为 “data”，一个名为 “ones”。

![名为 data 和 ones 的两个 NumPy 数组](https://numpy.org/doc/stable/user/_images/np_array_dataones.png)

您可以用加号将数组相加。

```python
>>> data = np.array([1, 2])
>>> ones = np.ones(2, dtype=int)
>>> data + ones
array([2, 3])
```

![两个 NumPy 数组相加的结果](https://numpy.org/doc/stable/user/_images/np_data_plus_ones.png)

当然，您能做的不仅仅是加法！

```python
>>> data - ones
array([0, 1])
>>> data * data
array([1, 4])
>>> data / data
array([1., 1.])
```

![NumPy 数组的减法、乘法和除法运算](https://numpy.org/doc/stable/user/_images/np_sub_mult_divide.png)

使用 NumPy，基本运算很简单。如果您想求数组中元素的和，您可以使用 `sum()`。这适用于一维数组、二维数组以及更高维度的数组。

```python
>>> a = np.array([1, 2, 3, 4])

>>> a.sum()
10
```

要对二维数组的行或列求和，您需要指定轴。

如果您从这个数组开始：

```python
>>> b = np.array([[1, 1], [2, 2]])
```

您可以沿行轴求和：

```python
>>> b.sum(axis=0)
array([3, 3])
```

您可以沿列轴求和：

```python
>>> b.sum(axis=1)
array([2, 4])
```

[在此处了解有关基本运算的更多信息](https://numpy.org/doc/stable/user/quickstart.html#quickstart-basic-operations)。

## 广播（Broadcasting）

有时您可能想要在数组和单个数字之间（也称为*向量和标量之间的运算*）或在两个不同大小的数组之间执行运算。例如，您的数组（我们称之为“data”）可能包含以英里为单位的距离信息，但您希望将信息转换为公里。您可以通过以下方式执行此操作：

```python
>>> data = np.array([1.0, 2.0])
>>> data * 1.6
array([1.6, 3.2])
```

![NumPy 数组与标量相乘的广播示例](https://numpy.org/doc/stable/user/_images/np_multiply_broadcasting.png)

NumPy 明白这个乘法应该在每个单元格上进行。这个概念被称为**广播**。广播是一种机制，它允许 NumPy 对不同形状的数组执行操作。您的数组维度必须兼容，例如，当两个数组的维度相等或其中一个为 1 时。如果维度不兼容，您将收到一个 `ValueError`。

[在此处了解有关广播的更多信息](https://numpy.org/doc/stable/user/basics.broadcasting.html#basics-broadcasting)。

## 更多有用的数组操作

*本节涵盖最大值、最小值、求和、平均值、乘积、标准差等*

---

NumPy 还能执行聚合函数。除了 `min`、`max` 和 `sum` 之外，您还可以轻松地运行 `mean` 来获取平均值，`prod` 来获取所有元素相乘的结果，`std` 来获取标准差等等。

```python
>>> data.max()
2.0
>>> data.min()
1.0
>>> data.sum()
3.0
```

![NumPy 数组的聚合函数示例](https://numpy.org/doc/stable/user/_images/np_aggregation.png)

让我们从这个名为 “a” 的数组开始：

```python
>>> a = np.array([[0.45053314, 0.17296777, 0.34376245, 0.5510652 ],
...               [0.54627315, 0.05093587, 0.40067661, 0.55645993],
...               [0.12697628, 0.82485143, 0.26590556, 0.56917101]])
```

通常需要沿着行或列进行聚合。默认情况下，每个 NumPy 聚合函数都将返回整个数组的聚合结果。要查找数组中元素的总和或最小值，请运行：

```python
>>> a.sum()
4.8595784
```

或者：

```python
>>> a.min()
0.05093587
```

您可以指定要在哪个轴上计算聚合函数。例如，您可以通过指定 `axis=0` 来查找每列中的最小值。

```python
>>> a.min(axis=0)
array([0.12697628, 0.05093587, 0.26590556, 0.5510652 ])
```

上面列出的四个值对应于数组中的列数。对于一个四列数组，您将得到四个值作为结果。

[在此处阅读有关数组方法的更多信息](https://numpy.org/doc/stable/reference/arrays.ndarray.html#array-ndarray-methods)。

## 创建矩阵

您可以传递 Python 的列表的列表来创建一个二维数组（或“矩阵”），以便在 NumPy 中表示它们。

```python
>>> data = np.array([[1, 2], [3, 4], [5, 6]])
>>> data
array([[1, 2],
       [3, 4],
       [5, 6]])
```

![使用 NumPy 创建矩阵](https://numpy.org/doc/stable/user/_images/np_create_matrix.png)

当您操作矩阵时，索引和切片操作非常有用：

```python
>>> data[0, 1]
2
>>> data[1:3]
array([[3, 4],
       [5, 6]])
>>> data[0:2, 0]
array([1, 3])
```

![对 NumPy 矩阵进行索引和切片](https://numpy.org/doc/stable/user/_images/np_matrix_indexing.png)

您可以像聚合向量一样聚合矩阵：

```python
>>> data.max()
6
>>> data.min()
1
>>> data.sum()
21
```

![对 NumPy 矩阵进行聚合操作](https://numpy.org/doc/stable/user/_images/np_matrix_aggregation.png)

您可以聚合矩阵中的所有值，也可以使用 `axis` 参数跨列或行聚合它们。为了说明这一点，让我们看一个稍作修改的数据集：

```python
>>> data = np.array([[1, 2], [5, 3], [4, 6]])
>>> data
array([[1, 2],
       [5, 3],
       [4, 6]])
>>> data.max(axis=0)
array([5, 6])
>>> data.max(axis=1)
array([2, 5, 6])
```

![对 NumPy 矩阵按行进行聚合](https://numpy.org/doc/stable/user/_images/np_matrix_aggregation_row.png)

一旦创建了矩阵，如果两个矩阵大小相同，您可以使用算术运算符对它们进行加法和乘法运算。

```python
>>> data = np.array([[1, 2], [3, 4]])
>>> ones = np.array([[1, 1], [1, 1]])
>>> data + ones
array([[2, 3],
       [4, 5]])
```

![两个 NumPy 矩阵的算术运算](https://numpy.org/doc/stable/user/_images/np_matrix_arithmetic.png)

您可以对不同大小的矩阵执行这些算术运算，但前提是其中一个矩阵只有一列或一行。在这种情况下，NumPy 将对其操作使用广播规则。

```python
>>> data = np.array([[1, 2], [3, 4], [5, 6]])
>>> ones_row = np.array([[1, 1]])
>>> data + ones_row
array([[2, 3],
       [4, 5],
       [6, 7]])
```

![不同大小矩阵间的广播运算](https://numpy.org/doc/stable/user/_images/np_matrix_broadcasting.png)

请注意，当 NumPy 打印 N 维数组时，最后一个轴的遍历速度最快，而第一个轴的遍历速度最慢。例如：

```python
>>> np.ones((4, 3, 2))
array([[[1., 1.],
        [1., 1.],
        [1., 1.]],

       [[1., 1.],
        [1., 1.],
        [1., 1.]],

       [[1., 1.],
        [1., 1.],
        [1., 1.]],

       [[1., 1.],
        [1., 1.],
        [1., 1.]]])
```

通常情况下，我们希望 NumPy 初始化数组的值。NumPy 为此提供了像 `ones()` 和 `zeros()` 这样的函数，以及用于生成随机数的 `random.Generator` 类。您需要做的就是传入您希望它生成的元素数量：

```python
>>> np.ones(3)
array([1., 1., 1.])
>>> np.zeros(3)
array([0., 0., 0.])
>>> rng = np.random.default_rng()  # 生成随机数的最简单方法
>>> rng.random(3)
array([0.63696169, 0.26978671, 0.04097352])
```

![使用 ones, zeros 和 random 初始化 NumPy 数组](https://numpy.org/doc/stable/user/_images/np_ones_zeros_random.png)

如果您给 `ones()`、`zeros()` 和 `random()` 传递一个描述矩阵维度的元组，您也可以用它们来创建二维数组：

```python
>>> np.ones((3, 2))
array([[1., 1.],
       [1., 1.],
       [1., 1.]])
>>> np.zeros((3, 2))
array([[0., 0.],
       [0., 0.],
       [0., 0.]])
>>> rng.random((3, 2))
array([[0.01652764, 0.81327024],
       [0.91275558, 0.60663578],
       [0.72949656, 0.54362499]])  # 结果可能不同
```

![使用 ones 和 zeros 创建矩阵](https://numpy.org/doc/stable/user/_images/np_ones_zeros_matrix.png)

在[数组创建例程](https://numpy.org/doc/stable/reference/routines.array-creation.html#routines-array-creation)中阅读有关创建填充了 `0`、`1`、其他值或未初始化值的数组的更多信息。

## 生成随机数

随机数生成是许多数值和机器学习算法配置和评估的重要组成部分。无论您是需要随机初始化人工神经网络中的权重、将数据拆分为随机集，还是随机打乱您的数据集，能够生成随机数（实际上是可重复的伪随机数）都是必不可少的。

使用 `Generator.integers`，您可以生成从低（请记住，在 NumPy 中这是包含的）到高（不包含的）的随机整数。您可以设置 `endpoint=True` 使上界也包含在内。

您可以用以下方式生成一个 2 x 4 的介于 0 和 4 之间的随机整数数组：

```python
>>> rng.integers(5, size=(2, 4))
array([[2, 1, 1, 0],
       [0, 0, 0, 4]])  # 结果可能不同
```

[在此处阅读有关随机数生成的更多信息](https://numpy.org/doc/stable/reference/random/index.html#numpyrandom)。

## 如何获取唯一项和计数

*本节涵盖 `np.unique()`*

---

您可以使用 `np.unique` 轻松找到数组中的唯一元素。

例如，如果您从这个数组开始：

```python
>>> a = np.array([11, 11, 12, 13, 14, 15, 16, 17, 12, 13, 11, 14, 18, 19, 20])
```

您可以使用 `np.unique` 打印出数组中的唯一值：

```python
>>> unique_values = np.unique(a)
>>> print(unique_values)
[11 12 13 14 15 16 17 18 19 20]
```

要获取 NumPy 数组中唯一值的索引（唯一值在原数组中首次出现位置的数组），只需在 `np.unique()` 中传递 `return_index` 参数以及您的数组即可。

```python
>>> unique_values, indices_list = np.unique(a, return_index=True)
>>> print(indices_list)
[ 0  2  3  4  5  6  7 12 13 14]
```

您可以在 `np.unique()` 中传递 `return_counts` 参数以及您的数组，以获取 NumPy 数组中唯一值的出现频率计数。

```python
>>> unique_values, occurrence_count = np.unique(a, return_counts=True)
>>> print(occurrence_count)
[3 2 2 2 1 1 1 1 1 1]```

这也适用于二维数组！如果您从这个数组开始：

```python
>>> a_2d = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [1, 2, 3, 4]])
```

您可以用以下方式找到唯一值：

```python
>>> unique_values = np.unique(a_2d)
>>> print(unique_values)
[ 1  2  3  4  5  6  7  8  9 10 11 12]
```

如果不传递 `axis` 参数，您的二维数组将被展平。

如果您想获取唯一的行或列，请确保传递 `axis` 参数。要找到唯一的行，请指定 `axis=0`，对于列，请指定 `axis=1`。

```python
>>> unique_rows = np.unique(a_2d, axis=0)
>>> print(unique_rows)
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
```

要获取唯一的行、索引位置和出现次数，您可以使用：

```python
>>> unique_rows, indices, occurrence_count = np.unique(
...      a_2d, axis=0, return_counts=True, return_index=True)
>>> print(unique_rows)
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
>>> print(indices)
[0 1 2]
>>> print(occurrence_count)
[2 1 1]
```

要了解更多关于查找数组中唯一元素的信息，请参阅 [`unique`](https://numpy.org/doc/stable/reference/generated/numpy.unique.html#numpy.unique)。

## 转置和重塑矩阵

*本节涵盖 `arr.reshape()`、`arr.transpose()`、`arr.T`*

---

转置矩阵是常见需求。NumPy 数组有一个 `T` 属性，允许您转置矩阵。

![NumPy 数组的转置和重塑](https://numpy.org/doc/stable/user/_images/np_transposing_reshaping.png)

您可能还需要切换矩阵的维度。例如，当您的模型期望某种输入形状，而该形状与您的数据集不同时，就可能发生这种情况。这时 `reshape` 方法就很有用。您只需传入您想要的矩阵的新维度即可。

```python
>>> data.reshape(2, 3)
array([[1, 2, 3],
       [4, 5, 6]])
>>> data.reshape(3, 2)
array([[1, 2],
       [3, 4],
       [5, 6]])
```

![重塑一个 NumPy 数组](https://numpy.org/doc/stable/user/_images/np_reshape.png)

您还可以使用 `.transpose()` 根据您指定的值来反转或更改数组的轴。

如果您从这个数组开始：

```python
>>> arr = np.arange(6).reshape((2, 3))
>>> arr
array([[0, 1, 2],
       [3, 4, 5]])
```

您可以用 `arr.transpose()` 转置您的数组。

```python
>>> arr.transpose()
array([[0, 3],
       [1, 4],
       [2, 5]])
```

您也可以使用 `arr.T`：

```python
>>> arr.T
array([[0, 3],
       [1, 4],
       [2, 5]])
```

要了解更多关于数组转置和重塑的信息，请参阅 [`transpose`](https://numpy.org/doc/stable/reference/generated/numpy.transpose.html#numpy.transpose) 和 [`reshape`](https://numpy.org/doc/stable/reference/generated/numpy.reshape.html#numpy.reshape)。

## 如何翻转数组

*本节涵盖 `np.flip()`*

---

NumPy 的 `np.flip()` 函数允许您沿一个轴翻转或反转数组的内容。使用 `np.flip()` 时，请指定您想要反转的数组和轴。如果您不指定轴，NumPy 将沿输入数组的所有轴反转内容。

**反转一维数组**

如果您从这样一个一维数组开始：

```python
>>> arr = np.array([1, 2, 3, 4, 5, 6, 7, 8])
```

您可以用以下方式反转它：

```python
>>> reversed_arr = np.flip(arr)
```

如果您想打印反转后的数组，可以运行：

```python
>>> print('Reversed Array: ', reversed_arr)
Reversed Array:  [8 7 6 5 4 3 2 1]
```

**反转二维数组**

二维数组的工作方式大致相同。

如果您从这个数组开始：

```python
>>> arr_2d = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
```

您可以用以下方式反转所有行和所有列的内容：

```python
>>> reversed_arr = np.flip(arr_2d)
>>> print(reversed_arr)
[[12 11 10  9]
 [ 8  7  6  5]
 [ 4  3  2  1]]
```

您可以轻松地只反转*行*：

```python
>>> reversed_arr_rows = np.flip(arr_2d, axis=0)
>>> print(reversed_arr_rows)
[[ 9 10 11 12]
 [ 5  6  7  8]
 [ 1  2  3  4]]
```

或者只反转*列*：

```python
>>> reversed_arr_columns = np.flip(arr_2d, axis=1)
>>> print(reversed_arr_columns)
[[ 4  3  2  1]
 [ 8  7  6  5]
 [12 11 10  9]]```

您还可以只反转一列或一行的内容。例如，您可以反转索引位置为 1 的行（第二行）的内容：

```python
>>> arr_2d[1] = np.flip(arr_2d[1])
>>> print(arr_2d)
[[ 1  2  3  4]
 [ 8  7  6  5]
 [ 9 10 11 12]]
```

您还可以反转索引位置为 1 的列（第二列）：

```python
>>> arr_2d[:,1] = np.flip(arr_2d[:,1])
>>> print(arr_2d)
[[ 1 10  3  4]
 [ 8  7  6  5]
 [ 9  2 11 12]]
```

在 [`flip`](https://numpy.org/doc/stable/reference/generated/numpy.flip.html#numpy.flip) 中阅读有关翻转数组的更多信息。

## 重塑和展平多维数组

*本节涵盖 `.flatten()`、`ravel()`*

---

展平数组有两种流行的方法：`.flatten()` 和 `.ravel()`。两者之间的主要区别在于，使用 `ravel()` 创建的新数组实际上是对父数组的引用（即“视图”）。这意味着对新数组的任何更改都将影响父数组。由于 `ravel` 不会创建副本，因此它具有内存效率。

如果您从这个数组开始：

```python
>>> x = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
```

您可以使用 `flatten` 将您的数组展平为一维数组。

```python
>>> x.flatten()
array([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])
```

当您使用 `flatten` 时，对新数组的更改不会改变父数组。

例如：

```python
>>> a1 = x.flatten()
>>> a1[0] = 99
>>> print(x)  # 原始数组
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
>>> print(a1)  # 新数组
[99  2  3  4  5  6  7  8  9 10 11 12]
```

但是当您使用 `ravel` 时，您对新数组所做的更改将影响父数组。

例如：

```python
>>> a2 = x.ravel()
>>> a2[0] = 98
>>> print(x)  # 原始数组
[[98  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
>>> print(a2)  # 新数组
[98  2  3  4  5  6  7  8  9 10 11 12]
```

在 [`ndarray.flatten`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html#numpy.ndarray.flatten) 中阅读有关 `flatten` 的更多信息，在 [`ravel`](https://numpy.org/doc/stable/reference/generated/numpy.ravel.html#numpy.ravel) 中阅读有关 `ravel` 的更多信息。

## 如何访问文档字符串以获取更多信息

*本节涵盖 `help()`、`?`、`??`*

---

在数据科学生态系统中，Python 和 NumPy 的构建都考虑到了用户。最好的例子之一就是内置的文档访问功能。每个对象都包含对一个字符串的引用，这个字符串被称为**文档字符串（docstring）**。在大多数情况下，这个文档字符串包含对该对象的简明摘要以及如何使用它。Python 有一个内置的 `help()` 函数，可以帮助您访问这些信息。这意味着几乎在任何时候您需要更多信息，都可以使用 `help()` 快速找到您需要的信息。

例如：

```python
>>> help(max)
Help on built-in function max in module builtins:

max(...)
    max(iterable, *[, default=obj, key=func]) -> value
    max(arg1, arg2, *args, *[, key=func]) -> value

    With a single iterable argument, return its biggest item. The
    default keyword-only argument specifies an object to return if
    the provided iterable is empty.
    With two or more arguments, return the largest argument.
```

因为访问额外信息非常有用，IPython 使用 `?` 字符作为访问此文档以及其他相关信息的快捷方式。IPython 是一个用于多种语言交互式计算的命令 shell。[您可以在这里找到更多关于 IPython 的信息](https://ipython.org/)。

例如：

```ipython
In [0]: max?
max(iterable, *[, default=obj, key=func]) -> value
max(arg1, arg2, *args, *[, key=func]) -> value

With a single iterable argument, return its biggest item. The
default keyword-only argument specifies an object to return if
the provided iterable is empty.
With two or more arguments, return the largest argument.
Type:      builtin_function_or_method
```

您甚至可以对对象方法和对象本身使用此表示法。

假设您创建了这个数组：

```python
>>> a = np.array([1, 2, 3, 4, 5, 6])
```

然后您可以获得大量有用的信息（首先是关于 `a` 本身的详细信息，然后是 `a` 作为实例的 `ndarray` 的文档字符串）：

```ipython
In [1]: a?
Type:            ndarray
String form:     [1 2 3 4 5 6]
Length:          6
File:            ~/anaconda3/lib/python3.9/site-packages/numpy/__init__.py
Docstring:       <no docstring>
Class docstring:
ndarray(shape, dtype=float, buffer=None, offset=0,
        strides=None, order=None)

An array object represents a multidimensional, homogeneous array
of fixed-size items.  An associated data-type object describes the
format of each element in the array (its byte-order, how many bytes it
occupies in memory, whether it is an integer, a floating point number,
or something else, etc.)

Arrays should be constructed using `array`, `zeros` or `empty` (refer
to the See Also section below).  The parameters given here refer to
a low-level method (`ndarray(...)`) for instantiating an array.

For more information, refer to the `numpy` module and examine the
methods and attributes of an array.

Parameters
----------
(for the __new__ method; see Notes below)

shape : tuple of ints
        Shape of created array.
...
```

这也适用于**您**创建的函数和其他对象。只需记住用字符串字面量（在您的文档周围使用 `""" """` 或 `''' '''`）为您的函数包含一个文档字符串。

例如，如果您创建此函数：

```python
>>> def double(a):
...   '''Return a * 2'''
...   return a * 2
```

您可以获取有关该函数的信息：

```ipython
In [2]: double?
Signature: double(a)
Docstring: Return a * 2
File:      ~/Desktop/<ipython-input-23-b5adf20be596>
Type:      function
```

通过阅读您感兴趣的对象的源代码，您可以获得更深层次的信息。使用双问号 (`??`) 可以让您访问源代码。

例如：

```ipython
In [3]: double??
Signature: double(a)
Source:
def double(a):
    '''Return a * 2'''
    return a * 2
File:      ~/Desktop/<ipython-input-23-b5adf20be596>
Type:      function
```

如果所讨论的对象是用 Python 以外的语言编译的，那么使用 `??` 将返回与 `?` 相同的信息。您会在许多内置对象和类型中发现这一点，例如：

```ipython
In [4]: len?
Signature: len(obj, /)
Docstring: Return the number of items in a container.
Type:      builtin_function_or_method
```

和：

```ipython
In [5]: len??
Signature: len(obj, /)
Docstring: Return the number of items in a container.
Type:      builtin_function_or_method
```

具有相同的输出，因为它们是用 Python 以外的编程语言编译的。

## 使用数学公式

能够轻松实现作用于数组的数学公式，是 NumPy 在科学 Python 社区中被广泛使用的原因之一。

例如，这是均方误差公式（在处理回归的监督式机器学习模型中使用的核心公式）：

![均方误差公式](https://numpy.org/doc/stable/user/_images/np_MSE_formula.png)

在 NumPy 中实现这个公式简单明了：

![使用 NumPy 实现均方误差公式](https://numpy.org/doc/stable/user/_images/np_MSE_implementation.png)

这之所以如此有效，是因为 `predictions` 和 `labels` 可以包含一个或一千个值。它们只需要大小相同即可。

您可以这样将其可视化：

![均方误差计算的可视化第一步](https://numpy.org/doc/stable/user/_images/np_mse_viz1.png)

在这个例子中，`predictions` 和 `labels` 向量都包含三个值，意味着 `n` 的值为三。在我们执行减法后，向量中的值被平方。然后 NumPy 对这些值求和，您的结果就是该预测的误差值和模型质量的得分。

![均方误差计算的可视化第二步](https://numpy.org/doc/stable/user/_images/np_mse_viz2.png)![均方误差计算的解释](https://numpy.org/doc/stable/user/_images/np_MSE_explanation2.png)

## 如何保存和加载 NumPy 对象

*本节涵盖 `np.save`、`np.savez`、`np.savetxt`、`np.load`、`np.loadtxt`*

---

在某些时候，您会希望将数组保存到磁盘并重新加载它们，而不必重新运行代码。幸运的是，使用 NumPy 有几种保存和加载对象的方法。`ndarray` 对象可以使用处理普通文本文件的 `loadtxt` 和 `savetxt` 函数、处理带有 **.npy** 文件扩展名的 NumPy 二进制文件的 `load` 和 `save` 函数，以及处理带有 **.npz** 文件扩展名的 NumPy 文件的 `savez` 函数来保存到磁盘文件和从磁盘文件加载。

**.npy** 和 **.npz** 文件存储数据、形状、dtype 和其他重建 ndarray 所需的信息，其方式允许数组被正确检索，即使文件在具有不同体系结构的另一台机器上也是如此。

如果您想存储单个 `ndarray` 对象，请使用 `np.save` 将其存储为 .npy 文件。如果您想在单个文件中存储多个 `ndarray` 对象，请使用 `np.savez` 将其保存为 .npz 文件。您还可以使用 [`savez_compressed`](https://numpy.org/doc/stable/reference/generated/numpy.savez_compressed.html#numpy.savez_compressed) 将多个数组保存到单个压缩的 npz 格式文件中。

使用 `np.save()` 保存和加载数组很容易。只需确保指定要保存的数组和文件名。例如，如果您创建此数组：

```python
>>> a = np.array([1, 2, 3, 4, 5, 6])
```

您可以用以下方式将其保存为 “filename.npy”：

```python
>>> np.save('filename', a)
```

您可以使用 `np.load()` 来重建您的数组。

```python
>>> b = np.load('filename.npy')
```

如果您想检查您的数组，可以运行：

```python
>>> print(b)
[1 2 3 4 5 6]
```

您可以使用 `np.savetxt` 将 NumPy 数组保存为纯文本文件，如 **.csv** 或 **.txt** 文件。

例如，如果您创建此数组：

```python
>>> csv_arr = np.array([1, 2, 3, 4, 5, 6, 7, 8])
```

您可以轻松地将其保存为名为 “new_file.csv” 的 .csv 文件，如下所示：

```python
>>> np.savetxt('new_file.csv', csv_arr)
```

您可以使用 `loadtxt()` 快速轻松地加载您保存的文本文件：

```python
>>> np.loadtxt('new_file.csv')
array([1., 2., 3., 4., 5., 6., 7., 8.])
```

`savetxt()` 和 `loadtxt()` 函数接受其他可选参数，如 `header`、`footer` 和 `delimiter`。虽然文本文件可能更容易共享，但 .npy 和 .npz 文件更小，读取速度更快。如果您需要对文本文件进行更复杂的处理（例如，如果您需要处理包含缺失值的行），您将需要使用 [`genfromtxt`](https://numpy.org/doc/stable/reference/generated/numpy.genfromtxt.html#numpy.genfromtxt) 函数。

使用 [`savetxt`](https://numpy.org/doc/stable/reference/generated/numpy.savetxt.html#numpy.savetxt)，您可以指定页眉、页脚、注释等。

[在此处了解有关输入和输出例程的更多信息](https://numpy.org/doc/stable/reference/routines.io.html#routines-io)。

## 导入和导出 CSV

读取包含现有信息的 CSV 很简单。最好和最简单的方法是使用 [Pandas](https://pandas.pydata.org)。

```python
>>> import pandas as pd

>>> # 如果您所有的列都是相同类型：
>>> x = pd.read_csv('music.csv', header=0).values
>>> print(x)
[['Billie Holiday' 'Jazz' 1300000 27000000]
 ['Jimmie Hendrix' 'Rock' 2700000 70000000]
 ['Miles Davis' 'Jazz' 1500000 48000000]
 ['SIA' 'Pop' 2000000 74000000]]

>>> # 您也可以只选择您需要的列：
>>> x = pd.read_csv('music.csv', usecols=['Artist', 'Plays']).values
>>> print(x)
[['Billie Holiday' 27000000]
 ['Jimmie Hendrix' 70000000]
 ['Miles Davis' 48000000]
 ['SIA' 74000000]]
```

![使用 Pandas 处理 CSV 数据](https://numpy.org/doc/stable/user/_images/np_pandas.png)

使用 Pandas 导出您的数组也很简单。如果您是 NumPy 的新手，您可能希望根据数组中的值创建一个 Pandas DataFrame，然后使用 Pandas 将该 DataFrame 写入 CSV 文件。

如果您创建了这个数组 “a”：

```python
>>> a = np.array([[-2.58289208,  0.43014843, -1.24082018, 1.59572603],
...               [ 0.99027828,  1.17150989,  0.94125714, -0.14692469],
...               [ 0.76989341,  0.81299683, -0.95068423, 0.11769564],
...               [ 0.20484034,  0.34784527,  1.96979195, 0.51992837]])
```

您可以创建一个 Pandas DataFrame：

```python
>>> df = pd.DataFrame(a)
>>> print(df)
          0         1         2         3
0 -2.582892  0.430148 -1.240820  1.595726
1  0.990278  1.171510  0.941257 -0.146925
2  0.769893  0.812997 -0.950684  0.117696
3  0.204840  0.347845  1.969792  0.519928
```

您可以轻松地用以下方式保存您的 DataFrame：

```python
>>> df.to_csv('pd.csv')
```

并用以下方式读取您的 CSV：

```python
>>> data = pd.read_csv('pd.csv')
```

![使用 Pandas 读取 CSV 文件](https://numpy.org/doc/stable/user/_images/np_readcsv.png)

您也可以使用 NumPy 的 `savetxt` 方法保存您的数组。

```python
>>> np.savetxt('np.csv', a, fmt='%.2f', delimiter=',', header='1,  2,  3,  4')
```

如果您正在使用命令行，您可以随时使用诸如以下的命令来读取您保存的 CSV：

```bash
$ cat np.csv
#  1,  2,  3,  4
-2.58,0.43,-1.24,1.60
0.99,1.17,0.94,-0.15
0.77,0.81,-0.95,0.12
0.20,0.35,1.97,0.52
```

或者您可以随时用文本编辑器打开该文件！

如果您有兴趣了解更多关于 Pandas 的信息，请查看[官方 Pandas 文档](https://pandas.pydata.org/index.html)。通过[官方 Pandas 安装信息](https://pandas.pydata.org/pandas-docs/stable/install.html)了解如何安装 Pandas。

## 使用 Matplotlib 绘制数组

如果您需要为您的值生成一个图表，使用 [Matplotlib](https://matplotlib.org/) 非常简单。

例如，您可能有一个像这样的数组：

```python
>>> a = np.array([2, 1, 5, 7, 4, 6, 8, 14, 10, 9, 18, 20, 22])
```

如果您已经安装了 Matplotlib，您可以用以下方式导入它：

```python
>>> import matplotlib.pyplot as plt

# 如果您正在使用 Jupyter Notebook，您可能还希望运行以下
# 代码行以在 notebook 中显示您的图表：

%matplotlib inline```

要绘制您的值，您需要做的就是运行：

```python
>>> plt.plot(a)

# 如果您是从命令行运行，您可能需要这样做：
# >>> plt.show()
```

<figure style="text-align: center;">
<img alt="使用 Matplotlib 绘制简单线图" src="https://numpy.org/doc/stable/user/_images/matplotlib1.png" />
</figure>

例如，您可以像这样绘制一个一维数组：

```python
>>> x = np.linspace(0, 5, 20)
>>> y = np.linspace(0, 10, 20)
>>> plt.plot(x, y, 'purple') # 线
>>> plt.plot(x, y, 'o')      # 点
```

<figure style="text-align: center;">
<img alt="使用 Matplotlib 绘制线和点" src="https://numpy.org/doc/stable/user/_images/matplotlib2.png" />
</figure>

使用 Matplotlib，您可以访问大量的可视化选项。

```python
>>> fig = plt.figure()
>>> ax = fig.add_subplot(projection='3d')
>>> X = np.arange(-5, 5, 0.15)
>>> Y = np.arange(-5, 5, 0.15)
>>> X, Y = np.meshgrid(X, Y)
>>> R = np.sqrt(X**2 + Y**2)
>>> Z = np.sin(R)

>>> ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap='viridis')
```

<figure style="text-align: center;">
<img alt="使用 Matplotlib 绘制 3D 表面图" src="https://numpy.org/doc/stable/user/_images/matplotlib3.png" />
</figure>

要阅读更多关于 Matplotlib 及其功能的信息，请查看[官方文档](https://matplotlib.org/)。有关安装 Matplotlib 的说明，请参阅官方[安装部分](https://matplotlib.org/users/installing.html)。


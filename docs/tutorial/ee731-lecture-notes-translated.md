> [!NOTE]
> 由 <Icon icon="simple-icons:googlegemini"/>Gemini 2.5 Pro 翻译。

## **0 前言**

这本由十章组成的笔记将向读者介绍线性代数的基本原理，及其在现代工程与科学诸多学科中的应用，包括信号处理、控制理论、过程控制、应用统计学、机器人学等。我们假定读者已具备与大学一年级线性代数课程相当的背景知识，对概率论和统计学有初步了解，并掌握傅里叶变换的基础知识。

第一章确立了课程后续部分所需的一些基本概念。首先，我们探讨了线性代数的一些基本思想，如**线性无关 (linear independence)**、**子空间 (subspaces)**、**秩 (rank)**、**零空间 (nullspace)**、**值域 (range)** 等，以及这些概念之间的相互关系。接着，讨论并解释了**自相关 (autocorrelation)** 的概念以及信号的**协方差矩阵 (covariance matrix)**。

在第二章中，介绍了最基本的矩阵分解，即所谓的**特征分解 (eigendecomposition)**。本章的重点在于直观地揭示这种分解的作用。我们通过 **Karhunen-Loeve变换** 来说明特征分解的应用。这样，读者便能熟悉这种分解的重要性质。随后，Karhunen-Loeve变换被推广为更广泛的**变换编码 (transform coding)** 思想。

在第三章中，我们详细讲解了**奇异值分解 (singular value decomposition, SVD)**，它与矩阵的特征分解密切相关。我们阐述了这两种分解之间的关系，并探讨了SVD的各种性质。

第四章讨论**二次型 (quadratic form)** 及其与特征分解的关系，并初步介绍了浮点数系统中的**误差机制 (error mechanisms)**。此外，本章还阐述了矩阵的**条件数 (condition number)**，它是在确定**线性方程组 (linear equations)** 解的相对误差**下界 (lower bound)** 时的关键部分。

第五章和第六章讨论了通过**高斯消元法 (Gaussian elimination)** 求解线性方程组。高斯消元过程通过一种更大分块矩阵的方法来描述，该方法能引出其他有用的分解，例如对称方阵的**Cholesky分解**。

第七至十章致力于求解**最小二乘问题 (least-squares problems)**。第七章阐述了**标准最小二乘问题 (standard least squares problem)** 及其解法。在第八章，我们提出了一种广义**“伪逆” (pseudoinverse)** 方法来求解最小二乘问题。第九章阐述了**QR分解**，其在线性最小二乘问题求解中的应用在第十章进行了讨论。

最后，在第十一章中，阐述了**托普利兹 (Toeplitz) 方程组**的解法及其相关理论。

## **1 基本概念**

本讲旨在回顾线性代数中的重要基本概念，为后续课程奠定基础。我们首先从“大块”（big block）的视角来讨论矩阵乘法、线性无关、子空间及相关思想、秩等基本构成要素，这些是线性代数严谨体系的基石。接着，我们将讨论向量范数以及矩阵乘法运算的多种解读。本章最后将以行列式的讨论作结。

### **1.1 符号表示**

在本课程中，我们将用符号 $\mathbf{A} \in \mathbb{R}^{m \times n}$ 表示一个维度为 $m \times n$ 且其元素取自实数集的矩阵 $\mathbf{A}$。这意味着矩阵 $\mathbf{A}$ 属于实数的笛卡尔积，该积共包含 $m \times n$ 个实数，对应于 $\mathbf{A}$ 的每一个元素。类似地，符号 $\mathbf{A} \in \mathbb{C}^{m \times n}$ 表示该矩阵的维度为 $m \times n$，其元素取自复数集。矩阵维度 $m \times n$ 指的是 $\mathbf{A}$ 包含 $m$ 行和 $n$ 列。

同样地，符号 $\mathbf{a} \in \mathbb{R}^m (\mathbb{C}^m)$ 表示一个维度为 $m$ 的向量，其元素取自实数（或复数）集。我们所说的“向量的维度”，是指它的长度，即它包含 $m$ 个元素。

此外，我们用符号 $a \in \mathbb{R}(\mathbb{C})$ 表示一个标量 $a$ 来自实数（或复数）集。因此，大写粗体字母表示矩阵，小写粗体字母表示向量，小写非粗体字母表示标量。

按照惯例，向量默认指列向量。对于一个矩阵 $\mathbf{A}$，我们用 $\mathbf{a}_i$ 表示其第 $i$ 列。我们同样用 $\mathbf{a}_j^T$ 表示其第 $j$ 行，尽管这种表示法可能存在歧义，因为它也可能被理解为第 $j$ 列的转置。具体的含义需要根据上下文来判断。

### **1.2 “大块”视角下的矩阵乘法解读**

我们定义矩阵乘积 $\mathbf{C}$ 如下：
$$
\mathbf{C}_{m \times n} = \mathbf{A}_{m \times k} \mathbf{B}_{k \times n} \quad (1)
$$
该运算的三种解读如下：

#### **1.2.1 内积表示**

如果 $\mathbf{a}$ 和 $\mathbf{b}$ 是两个长度相同的列向量，那么标量 $\mathbf{a}^T \mathbf{b}$ 被称为 $\mathbf{a}$ 和 $\mathbf{b}$ 的**内积 (inner product)**。如果我们定义 $\mathbf{a}_i^T \in \mathbb{R}^k$ 为 $\mathbf{A}$ 的第 $i$ 行，$\mathbf{b}_j \in \mathbb{R}^k$ 为 $\mathbf{B}$ 的第 $j$ 列，那么 $\mathbf{C}$ 的元素 $c_{ij}$ 就被定义为内积 $\mathbf{a}_i^T \mathbf{b}_j$。这是传统的小块表示法下的矩阵乘法。

#### **1.2.2 列表示**

这是矩阵乘法的一种更大块的视角。在这里，我们着眼于一次形成乘积的一列。$\mathbf{C}$ 的第 $j$ 列 $\mathbf{c}_j$可以表示为 $\mathbf{A}$ 的各列 $\mathbf{a}_i$ 的线性组合，其系数为 $\mathbf{B}$ 的第 $j$ 列的元素。因此，
$$
\mathbf{c}_j = \sum_{i=1}^{k} \mathbf{a}_i b_{ij}, \quad j = 1, \dots, n. \quad (2)
$$
这个运算与上面的内积表示法是相同的，只是我们一次形成一列。例如，如果我们只计算第 $j$ 列 $\mathbf{c}_j$ 的第 $p$ 个元素，我们会发现 (2) 式退化为 $\sum_{i=1}^{k} a_{pi} b_{ij}$。这正是 $\mathbf{A}$ 的第 $p$ 行与 $\mathbf{B}$ 的第 $j$ 列的内积，也就是 $\mathbf{C}$ 的 $(p, j)$ 位置元素所需的表达式。

#### **1.2.3 外积表示**

这是最大块的表示法。我们定义一个列向量 $\mathbf{a} \in \mathbb{R}^m$ 和一个行向量 $\mathbf{b}^T \in \mathbb{R}^n$。那么 $\mathbf{a}$ 和 $\mathbf{b}$ 的**外积 (outer product)** 是一个秩为 1 的 $m \times n$ 矩阵，定义为 $\mathbf{ab}^T$。

现在，令 $\mathbf{a}_i$ 和 $\mathbf{b}_i^T$ 分别为 $\mathbf{A}$ 的第 $i$ 列和 $\mathbf{B}$ 的第 $i$ 行。那么乘积 $\mathbf{C}$ 也可以表示为：
$$
\mathbf{C} = \sum_{i=1}^{k} \mathbf{a}_i \mathbf{b}_i^T. \quad (3)
$$
通过一次考察一列，我们可以看到这种形式的矩阵乘法与上面的列表述执行的是完全相同的操作。例如，乘积的第 $j$ 列 $\mathbf{c}_j$ 可由 (3) 式确定为 $\mathbf{c}_j = \sum_{i=1}^{k} \mathbf{a}_i b_{ij}$，这与 (2) 式完全相同。

#### **1.2.4 矩阵的左乘与右乘**

现在我们来看一些区分矩阵左乘和右乘的基本思想。在这方面，考虑矩阵 $\mathbf{A}$ **被** $\mathbf{B}$ **左乘 (pre-multiplied)** 得到 $\mathbf{Y} = \mathbf{BA}$。（所有矩阵均假定具有相容的维度）。我们可以将这个乘法解释为 $\mathbf{B}$ 作用于 $\mathbf{A}$ 的各列，从而得到乘积的各列。这是因为乘积的每一列 $\mathbf{y}_i$ 都是 $\mathbf{A}$ 对应列的变换版本；即 $\mathbf{y}_i = \mathbf{B}\mathbf{a}_i, \ i=1,\dots,n$。同样地，我们考虑 $\mathbf{A}$ **被**矩阵 $\mathbf{C}$ **右乘 (post-multiplied)** 得到 $\mathbf{X} = \mathbf{AC}$。那么，我们将这个乘法解释为 $\mathbf{C}$ 作用于 $\mathbf{A}$ 的各行，因为乘积的每一行 $\mathbf{x}_j^T$ 都是 $\mathbf{A}$ 对应行的变换版本；即 $\mathbf{x}_j^T = \mathbf{a}_j^T\mathbf{C}, \ j=1,\dots,m$，其中我们定义 $\mathbf{a}_j^T$ 为 $\mathbf{A}$ 的第 $j$ 行。

**示例：**
*   考虑一个适当维度的**标准正交矩阵 (orthonormal matrix)** $\mathbf{Q}$。我们知道，乘以一个标准正交矩阵会产生旋转操作。操作 $\mathbf{QA}$ 旋转 $\mathbf{A}$ 的每一列。操作 $\mathbf{AQ}$ 旋转每一行。

还有另一种方式来解读左乘和右乘。再次考虑矩阵 $\mathbf{A}$ 被 $\mathbf{B}$ 左乘得到 $\mathbf{Y} = \mathbf{BA}$。根据 (2) 式，$\mathbf{Y}$ 的第 $j$ 列 $\mathbf{y}_j$ 是 $\mathbf{B}$ 各列的线性组合，其系数是 $\mathbf{A}$ 的第 $j$ 列。同样，对于 $\mathbf{X} = \mathbf{AB}$，我们可以说 $\mathbf{X}$ 的第 $i$ 行 $\mathbf{x}_i^T$ 是 $\mathbf{B}$ 各行的线性组合，其系数是 $\mathbf{A}$ 的第 $i$ 行。

这两种解读都是同样有效的。熟练掌握本节中的各种表示法，是精通线性代数领域的重要一步。

### **1.3 基础线性代数**

#### **1.3.1 线性无关**

假设我们有一个由 $n$ 个 $m$ 维向量组成的集合 $\{\mathbf{a}_1, \dots, \mathbf{a}_n\}$，其中 $\mathbf{a}_i \in \mathbb{R}^m, i=1,\dots,n$。这个集合是线性无关的，需满足以下条件：[^1]
$$
\sum_{j=1}^{n} c_j \mathbf{a}_j = \mathbf{0} \quad \text{当且仅当} \quad c_1, \dots, c_n = 0 \quad (4)
$$
换言之：
> 式 (4) 意味着，一个向量集合是**线性无关 (linearly independent)** 的，**当且仅当**这些向量的唯一零线性组合是系数全为零的组合。

[^1]: 式 (4) 被称为向量 $\mathbf{a}_j$ 的**线性组合 (linear combination)**。每个向量乘以一个权重（或**系数**）$c_j$，然后将结果求和。

一个由 $n$ 个向量组成的集合是线性无关的，如果通过取这些向量的所有可能的线性组合，可以形成一个 $n$ 维空间。如果这个空间的维度小于 $n$，那么这些向量是**线性相关 (linearly dependent)** 的。关于向量空间和向量空间维度的概念将在稍后更精确地阐述。

请注意，一个向量集合 $\{\mathbf{a}_1, \dots, \mathbf{a}_n\}$，在 $n > m$ 的情况下，不可能是线性无关的。

**示例 1**
$$
\mathbf{A} = [\mathbf{a}_1 \ \mathbf{a}_2 \ \mathbf{a}_3] = \begin{bmatrix} 1 & 2 & 1 \\ 0 & 3 & -1 \\ 0 & 0 & 1 \end{bmatrix} \quad (5)
$$
这个集合是线性无关的。另一方面，集合
$$
\mathbf{B} = [\mathbf{b}_1 \ \mathbf{b}_2 \ \mathbf{b}_3] = \begin{bmatrix} 1 & 2 & -3 \\ 0 & 3 & -3 \\ 0 & 0 & 0 \end{bmatrix} \quad (6)
$$
不是线性无关的。这是因为第三列是前两列的线性组合。（-1 乘以第一列加上 -1 乘以第二列等于第三列。因此，在 (4) 式中导致结果为零的系数 $c_j$ 是 (1, 1, 1) 的任意标量倍数）。

#### **1.3.2 张成、值域与子空间**

在本节中，我们将探讨这三个密切相关的概念。事实上，它们的数学定义几乎相同，但在每种情况下的解释有所不同。

**张成 (Span):**

一个向量集合 $[\mathbf{a}_1, \dots, \mathbf{a}_n]$ 的张成，记作 $\text{span}[\mathbf{a}_1, \dots, \mathbf{a}_n]$，其中 $\mathbf{a}_i \in \mathbb{R}^m$，是由以下映射得到的点的集合：
$$
\text{span} [\mathbf{a}_1, \dots, \mathbf{a}_n] = \left\{ \mathbf{y} \in \mathbb{R}^m \ | \ \mathbf{y} = \sum_{j=1}^{n} c_j \mathbf{a}_j, \ c_j \in \mathbb{R} \right\}. \quad (7)
$$
换句话说，$\text{span} [\mathbf{a}_1, \dots, \mathbf{a}_n]$ 是向量 $\mathbf{a}_i$ 的所有可能线性组合的集合。如果这些向量是线性无关的，那么这个线性组合集合的维度是 $n$。如果向量是线性相关的，则维度小于 $n$。

张成空间中的向量集合被称为**向量空间 (vector space)**。向量空间的维度是构成该空间的线性组合中线性无关向量的数量。请注意，向量空间的维度**不是**构成线性组合的向量的维度（长度）。

**示例 2：** 考虑图 1 中的以下两个向量：



这两个向量的张成是这张纸所在的（无限延伸的）平面。

**子空间 (Subspaces):**

给定一个向量集合（空间）$[\mathbf{a}_1, \dots, \mathbf{a}_n] \in \mathbb{R}^m, m \ge n$，一个子空间 $S$ 是满足两个要求的向量子集：

1.  如果 $\mathbf{x}$ 和 $\mathbf{y}$ 在子空间中，那么 $\mathbf{x} + \mathbf{y}$ 仍然在子空间中。
2.  如果我们将子空间中的任意向量 $\mathbf{x}$ 乘以一个标量 $c$，那么 $c\mathbf{x}$ 仍然在子空间中。

这两个要求意味着，对于一个子空间，其中向量的任何线性组合本身也在该子空间内。将这个概念与张成的概念相比较，我们发现由向量 $[\mathbf{a}_1, \dots, \mathbf{a}_n]$ 定义的子空间与 $\text{span}[\mathbf{a}_1, \dots, \mathbf{a}_n]$ 是相同的。然而，子空间的概念多了一层解释，即构成子空间的向量集合必须是某个更大空间的子集。例如，图 1 中的向量 $[\mathbf{a}_1, \mathbf{a}_2]$ 定义了一个子空间（纸所在的平面），它是三维宇宙 $\mathbb{R}^3$ 的一个子集。

因此，形式上，$\text{span} [\mathbf{a}_1, \dots, \mathbf{a}_n]$ 的一个 $k$ 维子空间 $S$ 由 $\text{span}[\mathbf{a}_{i_1}, \dots, \mathbf{a}_{i_k}]$ 确定，其中不同的索引满足 $\{i_1, \dots, i_k\} \subset \{1, \dots, n\}$；也就是说，向量空间 $S = \text{span}[\mathbf{a}_{i_1}, \dots, \mathbf{a}_{i_k}]$ 是 $\text{span}[\mathbf{a}_1, \dots, \mathbf{a}_n]$ 的一个子集。

请注意，$[\mathbf{a}_{i_1}, \dots, \mathbf{a}_{i_k}]$ 不一定是子空间 $S$ 的一个**基 (basis)**。这个集合只有当它是一个**极大线性无关组 (maximally independent set)** 时才是一个基。这个概念稍后会讨论。集合 $\{\mathbf{a}_i\}$ 不需要是线性无关的来定义张成或子集。

* 示例 1 中向量 $[\mathbf{b}_1, \dots, \mathbf{b}_3]$ 的张成是什么？

**值域 (Range):**

矩阵 $\mathbf{A} \in \mathbb{R}^{m \times n}$ 的值域，记作 $R(\mathbf{A})$，是一个满足以下条件的子空间（向量集合）：
$$
R(\mathbf{A}) = \{ \mathbf{y} \in \mathbb{R}^m \ | \ \mathbf{y} = \mathbf{Ax}, \text{对于} \ \mathbf{x} \in \mathbb{R}^n \}. \quad (8)
$$
我们可以根据矩阵乘法的列表示 (2) 来解释上面的矩阵-向量乘法 $\mathbf{y} = \mathbf{Ax}$，其中乘积 $\mathbf{C}$ 只有一列。因此，我们看到 $\mathbf{y}$ 是 $\mathbf{A}$ 的列向量 $\mathbf{a}_i$ 的线性组合，其系数是 $\mathbf{x}$ 的元素 $x_i$。因此，(8) 等价于 (7)，$R(\mathbf{A})$ 就是 $\mathbf{A}$ 的列的张成。值域和张成之间的区别在于，值域的参数是一个矩阵，而张成的参数是一个向量集合。如果 $\mathbf{A}$ 的列是（或不是）线性无关的，那么 $R(\mathbf{A})$ 将（或不会）张成 $n$ 维空间。因此，向量空间 $R(\mathbf{A})$ 的维度小于或等于 $n$。任何向量 $\mathbf{y} \in R(\mathbf{A})$ 的维度（长度）是 $m$。

**示例 3:**
$$
\mathbf{A} = \begin{bmatrix} 1 & 5 & 3 \\ 2 & 4 & 3 \\ 3 & 3 & 3 \end{bmatrix} \quad (\text{最后一列是前两列的平均值}) \quad (9)
$$
$R(\mathbf{A})$ 是 $\mathbf{A}$ 的任意两列的所有线性组合的集合。

在 $n < m$（即 $\mathbf{A}$ 是一个**高矩阵 (tall matrix)**）的情况下，需要注意的是 $R(\mathbf{A})$ 确实是 $m$ 维“宇宙”$\mathbb{R}^m$ 的一个子空间。在这种情况下，$R(\mathbf{A})$ 的维度小于或等于 $n$。因此，$R(\mathbf{A})$ 并不张成整个宇宙，所以是它的一个子空间。

#### **1.3.3 极大线性无关组 (Maximally Independent Set)**

这是一个向量集合，它不能在不失去无关性的情况下变得更大，也不能在保持极大性的情况下变得更小；即，它是一个包含张成该空间的最大数量的无关向量的集合。

#### **1.3.4 基 (A Basis)**

一个子空间的**基 (basis)** 是该子空间内的任意一个极大线性无关组。它不是唯一的。

**示例 4.** 对于由以下矩阵前两列张成的子空间 $S$
$$
\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 3 & -3 & \\ & 3 & \end{bmatrix}, \quad \text{即,} \quad S = \left\{ \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \begin{bmatrix} 2 \\ 3 \\ 0 \end{bmatrix} \right\}
$$
的一个基是
$$
\mathbf{e}_1 = (1, 0, 0)^T \\
\mathbf{e}_2 = (0, 1, 0)^T.
$$
[^2]或在 $\text{span}[\mathbf{e}_1, \mathbf{e}_2]$ 中的任何其他线性无关集。

$S$ 中的任何向量都可以唯一地表示为基向量的线性组合。

#### **1.3.5 正交补子空间 (Orthogonal Complement Subspace)**

如果我们有一个由向量 $[\mathbf{a}_1, \dots, \mathbf{a}_n]$ 组成的 $n$ 维子空间 $S$，其中 $\mathbf{a}_i \in \mathbb{R}^m, i=1, \dots, n$，对于 $n \le m$，那么 $S$ 的维度为 $m-n$ 的正交补子空间 $S_{\perp}$ 定义为
$$
S_{\perp} = \{ \mathbf{y} \in \mathbb{R}^m | \mathbf{y}^T \mathbf{x} = 0 \ \text{对于所有} \ \mathbf{x} \in S \} \quad (10)
$$
即，$S_{\perp}$ 中的任何向量都与 $S$ 中的任何向量正交。$S_{\perp}$ 读作“S-perp”。

**示例 5：** 取示例 4 中定义 $S$ 的向量集：
$$
S \equiv \begin{bmatrix} 1 & 2 \\ 0 & 3 \\ 0 & 0 \end{bmatrix} \quad (11)
$$
那么，$S_{\perp}$ 的一个基是
$$
\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \quad (12)
$$

#### **1.3.6 秩 (Rank)**

秩是一个重要的概念，我们将在整个课程中频繁使用。在这里，我们只简要描述秩的几个基本特征。这个概念将在后续章节中更充分地展开。

1.  矩阵的**秩 (rank)** 是其线性无关的行或列的最大数量。因此，它是该矩阵的列（或行）的基的维度。
2.  $\mathbf{A}$ 的秩（记作 $\text{rank}(\mathbf{A})$）是 $R(\mathbf{A})$ 的维度。
3.  如果 $\mathbf{A} = \mathbf{BC}$，且 $r_1 = \text{rank}(\mathbf{B}), r_2 = \text{rank}(\mathbf{C})$，那么 $\text{rank}(\mathbf{A}) \le \min(r_1, r_2)$。
4.  如果一个矩阵 $\mathbf{A} \in \mathbb{R}^{m \times n}$ 的秩小于 $\min(m, n)$，则称其为**秩亏 (rank deficient)**。否则，称其为**满秩 (full rank)**。
5.  如果 $\mathbf{A}$ 是方阵且秩亏，则 $\det(\mathbf{A}) = 0$。
6.  可以证明 $\text{rank}(\mathbf{A}) = \text{rank}(\mathbf{A}^T)$。稍后会对此进行更多说明。

如果一个矩阵的秩等于其列（行）的数量，则称其为**列满秩 (full column rank)**（或**行满秩 (full row rank)**）。

**示例：** 示例 4 中 $\mathbf{A}$ 的秩是 3，而示例 3 中 $\mathbf{A}$ 的秩是 2。

[^2]: 向量 $\mathbf{e}_i$ 被称为**基本向量 (elementary vector)**，它在第 $i$ 个位置为 1，其余位置均为零。

#### **1.3.7 A的零空间 (Null Space of A)**

$\mathbf{A}$ 的**零空间 (null space)** $N(\mathbf{A})$ 定义为
$$
N(\mathbf{A}) = \{ \mathbf{x} \in \mathbb{R}^n \ne \mathbf{0} \ | \ \mathbf{Ax} = \mathbf{0} \}. \quad (13)
$$
根据之前的讨论，乘积 $\mathbf{Ax}$ 是 $\mathbf{A}$ 的列向量 $\mathbf{a}_i$ 的线性组合，其中 $\mathbf{x}$ 的元素 $x_i$ 是对应的系数。因此，从 (13) 可知，$N(\mathbf{A})$ 是 $\mathbf{A}$ 的列的所有零线性组合的非零系数集。如果 $\mathbf{A}$ 的列是线性无关的，那么根据定义，$N(\mathbf{A}) = \emptyset$，因为除了全零系数外，不存在任何系数可以产生零线性组合。在这种情况下，零空间的维度为零，且 $\mathbf{A}$ 是列满秩的。零空间为空当且仅当 $\mathbf{A}$ 是列满秩的，并且当 $\mathbf{A}$ 是**列秩亏 (column rank deficient)**[^3]:  时，零空间非空。请注意，$N(\mathbf{A})$ 中的任何向量的维度都是 $n$。$N(\mathbf{A})$ 中的任何向量都与 $\mathbf{A}$ 的行正交，因此它位于 $\mathbf{A}$ 行的张成的正交补空间中。

**示例 6：** 令 $\mathbf{A}$ 如示例 3 所示。则 $N(\mathbf{A}) = c(1, 1, -2)^T$，其中 $c$ 是一个实常数。

另一个例子如下。取 3 个向量 $[\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3]$，其中 $\mathbf{a}_i \in \mathbb{R}^3, i=1, \dots, 3$，且它们被约束在一个二维平面内。那么，这些向量存在一个零线性组合。这个线性组合的系数定义了一个向量 $\mathbf{x}$，它位于 $\mathbf{A} = [\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3]$ 的零空间中。在这种情况下，我们看到 $\mathbf{A}$ 是秩亏的。

矩阵的另一个重要特征是它的**零度 (nullity)**。$\mathbf{A}$ 的零度是 $\mathbf{A}$ 的零空间的维度。在上面的示例 6 中，$\mathbf{A}$ 的零度是一。我们有以下有趣的性质：
$$
\text{rank}(\mathbf{A}) + \text{nullity}(\mathbf{A}) = n. \quad (14)
$$
### **1.4 矩阵的四个基本子空间**

我们关注的四个矩阵子空间是：**列空间 (column space)**、**行空间 (row space)**，以及它们各自的**正交补空间 (orthogonal complements)**。这四个子空间的建立与 $N(\mathbf{A})$ 和 $R(\mathbf{A})$ 密切相关。本节我们假设 $\mathbf{A} \in \mathbb{R}^{m \times n}, r \le \min(m, n)$，其中 $r = \text{rank}\mathbf{A}$。

#### **1.4.1 列空间 (The Column Space)**

这即是 $R(\mathbf{A})$。它的维度是 $r$。它是 $\mathbf{A}$ 的列的所有线性组合的集合。

#### **1.4.2 列空间的正交补空间 (The Orthogonal Complement of the Column Space)**

这可以表示为 $R(\mathbf{A})_{\perp}$，维度为 $m-r$。可以证明它等价于 $N(\mathbf{A}^T)$，如下所示：根据定义，$N(\mathbf{A}^T)$ 是满足以下条件的向量 $\mathbf{x}$ 的集合：
$$
\begin{bmatrix} & \\ & \mathbf{A}^T \\ & \end{bmatrix} \begin{bmatrix} x_1 \\ \vdots \\ x_m \end{bmatrix} = \mathbf{0}, \quad (15)
$$
其中 $\mathbf{A}$ 的列是 $\mathbf{A}^T$ 的行。从 (15) 中，我们看到 $N(\mathbf{A}^T)$ 是与 $\mathbf{A}$ 的所有列（即 $\mathbf{A}^T$ 的行）正交的 $\mathbf{x} \in \mathbb{R}^m$ 的集合。根据定义，这就是 $R(\mathbf{A})$ 的正交补空间。

#### **1.4.3 行空间 (The Row Space)**

行空间简单地定义为 $R(\mathbf{A}^T)$，维度为 $r$。行空间是 $\mathbf{A}$ 的行的值域，或者是行的张成子空间，或者是 $\mathbf{A}$ 的行的所有可能线性组合的集合。

#### **1.4.4 行空间的正交补空间 (The Orthogonal Complement of the Row Space)**

这可以表示为 $R(\mathbf{A}^T)_{\perp}$。它的维度是 $n-r$。这个集合必须与 $\mathbf{A}$ 的所有行都正交：即，对于属于该空间的向量 $\mathbf{x}$，$\mathbf{x}$ 必须满足
$$
\begin{matrix} \text{rows} \\ \text{of} \\ \mathbf{A} \end{matrix} \rightarrow \begin{bmatrix} & & \\ & & \\ & & \\ & & \end{bmatrix} \begin{bmatrix} x_1 \\ \vdots \\ x_n \end{bmatrix} = \mathbf{0}. \quad (16)
$$
因此，满足 (16) 的向量集合 $\mathbf{x}$，即行空间的正交补空间，就是 $N(\mathbf{A})$。

[^3]: 列秩亏是指矩阵的秩小于其列数。

我们之前已经注意到 $\text{rank}(\mathbf{A}) = \text{rank}(\mathbf{A}^T)$。因此，行子空间和列子空间的维度是相等的。这一点令人惊讶，因为它意味着一个矩阵的线性无关行的数量与线性无关列的数量相同。这与矩阵的大小或秩无关。这不是一个直观上显而易见的事实，也没有直接明显的理由说明为什么会这样。然而，一个矩阵的秩就是其独立行或列的数量。

### **1.5 向量范数 (Vector Norms)**

**向量范数 (vector norm)** 是一种表示与向量相关的长度或距离的方法。向量空间 $\mathbb{R}^n$ 上的范数是一个函数 $f$，它将 $\mathbb{R}^n$ 中的一个点映射到 $\mathbb{R}$ 中的一个点。形式上，这在数学上表述为 $f: \mathbb{R}^n \rightarrow \mathbb{R}$。范数具有以下性质：

1.  $f(\mathbf{x}) \ge 0$ 对于所有 $\mathbf{x} \in \mathbb{R}^n$。
2.  $f(\mathbf{x}) = 0$ 当且仅当 $\mathbf{x} = \mathbf{0}$。
3.  $f(\mathbf{x} + \mathbf{y}) \le f(\mathbf{x}) + f(\mathbf{y})$ 对于 $\mathbf{x}, \mathbf{y} \in \mathbb{R}^n$。
4.  $f(a\mathbf{x}) = |a|f(\mathbf{x})$ 对于 $a \in \mathbb{R}, \mathbf{x} \in \mathbb{R}^n$。

我们用 $||\mathbf{x}||$ 表示函数 $f(\mathbf{x})$。

**p-范数 ($p$-norms):** 这是一类有用的范数，推广了欧几里得范数的概念。它们的定义如下：
$$
||\mathbf{x}||_p = (|x_1|^p + |x_2|^p + \dots + |x_n|^p)^{1/p}. \quad (17)
$$
如果 $p=1$：
$$
||\mathbf{x}||_1 = \sum_i |x_i|
$$
这即是各元素绝对值之和。

如果 $p=2$：
$$
||\mathbf{x}||_2 = \left(\sum_i x_i^2\right)^{1/2} = (\mathbf{x}^T\mathbf{x})^{1/2}
$$
这就是我们熟悉的欧几里得范数。

如果 $p=\infty$：
$$
||\mathbf{x}||_{\infty} = \max_i |x_i|
$$
即 $\mathbf{x}$ 中最大的元素。这可以通过以下方式证明。当 $p \rightarrow \infty$ 时，(17) 式圆括号内的最大项将主导所有其他项。因此 (17) 式可以写为
$$
||\mathbf{x}||_{\infty} = \lim_{p\to\infty} \left[\sum_{i=1}^{n} x_i^p\right]^{1/p} = \lim_{p\to\infty} [x_k^p]^{1/p} = x_k \quad (18)
$$
其中 $k$ 是对应最大元素 $x_i$ 的索引。

请注意，$p=2$ 范数有许多有用的性质，但计算成本较高。显然，1-范数和 $\infty$-范数更容易计算，但在代数上处理起来更困难。所有的 p-范数都遵循向量范数的所有性质。

### **1.6 行列式 (Determinants)**

考虑一个方阵 $\mathbf{A} \in \mathbb{R}^{m \times m}$。我们可以将矩阵 $\mathbf{A}_{ij}$ 定义为从 $\mathbf{A}$ 中删除第 $i$ 行和第 $j$ 列得到的子矩阵。标量数值 $\det(\mathbf{A}_{ij})$（其中 $\det(\cdot)$ 表示行列式）被称为与 $\mathbf{A}$ 的元素 $a_{ij}$ 相关联的**子式 (minor)**。带符号的子式 $c_{ij} \triangleq (-1)^{j+i} \det(\mathbf{A}_{ij})$ 被称为 $a_{ij}$ 的**代数余子式 (cofactor)**。

$\mathbf{A}$ 的行列式是由 $\mathbf{A}$ 的列（或行）所包含的 $m$ 维体积。行列式的这种解释非常有用，我们很快就会看到。

矩阵的行列式可以通过以下表达式计算：
$$
\det(\mathbf{A}) = \sum_{j=1}^{m} a_{ij} c_{ij}, \quad i \in (1 \dots m). \quad (19)
$$
或者
$$
\det(\mathbf{A}) = \sum_{i=1}^{m} a_{ij} c_{ij}, \quad j \in (1 \dots m). \quad (20)
$$
以上两者都被称为行列式的**代数余子式展开 (cofactor expansion)**。式 (19) 是沿 $\mathbf{A}$ 的第 $i$ 行展开，而 (20) 是沿第 $j$ 列展开。有趣的是，无论 $i$ 或 $j$ 的值如何，这两个版本都给出完全相同的数值。

式 (19) 和 (20) 用 $\mathbf{A}$ 的代数余子式 $c_{ij}$ 来表示 $m \times m$ 的行列式 $\det\mathbf{A}$，而这些代数余子式本身是 $(m-1) \times (m-1)$ 的行列式。因此，对 (19) 或 (20) 进行 $m-1$ 次递归最终将得到 $m \times m$ 矩阵 $\mathbf{A}$ 的行列式。

从 (19) 明显可知，如果 $\mathbf{A}$ 是三角矩阵，那么 $\det(\mathbf{A})$ 是主对角元素的乘积。由于对角矩阵属于上三角矩阵集合，因此对角矩阵的行列式也是其对角元素的乘积。

#### **行列式的性质 (Properties of Determinants)**

在开始讨论之前，我们先定义由构成矩阵的列向量集合所定义的平行多面体的体积为该矩阵的**主积 (principal volume)**。

我们有以下行列式的性质，这些性质在此不加证明地陈述：

1.  $\det(\mathbf{AB}) = \det(\mathbf{A})\det(\mathbf{B}) \quad \mathbf{A, B} \in \mathbb{R}^{m \times m}$。
    矩阵乘积的主积是每个矩阵主积的乘积。

2.  $\det(\mathbf{A}) = \det(\mathbf{A}^T)$
    这个性质表明 $\mathbf{A}$ 和 $\mathbf{A}^T$ 的特征多项式[^4]是相同的。因此，我们稍后会看到，$\mathbf{A}^T$ 和 $\mathbf{A}$ 的特征值是相同的。

3.  $\det(c\mathbf{A}) = c^m \det(\mathbf{A}) \quad c \in \mathbb{R}, \mathbf{A} \in \mathbb{R}^{m \times m}$。
    这反映了一个事实，即如果定义主积的每个向量都乘以 $c$，那么最终的体积将乘以 $c^m$。

4.  $\det(\mathbf{A}) = 0 \iff \mathbf{A}$ 是奇异的。
    这意味着相应矩阵的主积至少有一个维度坍缩为零长度。

5.  $\det(\mathbf{A}) = \prod_{i=1}^{m} \lambda_i$，其中 $\lambda_i$ 是 $\mathbf{A}$ 的特征（奇异）值。
    这意味着由矩阵的列或行向量定义的平行多面体可以变换成一个具有相同 $m$ 维体积的规则矩形实体，其边长对应于矩阵的特征（奇异）值。

6.  标准正交矩阵[^5]的行列式为 $\pm 1$。
    这很容易看出，因为标准正交矩阵的向量都是单位长度且相互正交。因此，相应的主积为 $\pm 1$。

7.  如果 $\mathbf{A}$ 是非奇异的，那么 $\det(\mathbf{A}^{-1}) = [\det(\mathbf{A})]^{-1}$。

8.  如果 $\mathbf{B}$ 是非奇异的，那么 $\det(\mathbf{B}^{-1}\mathbf{A}\mathbf{B}) = \det(\mathbf{A})$。

9.  如果 $\mathbf{B}$ 是通过交换 $\mathbf{A}$ 的任意两行（或列）得到的，那么 $\det(\mathbf{B}) = -\det(\mathbf{A})$。

10. 如果 $\mathbf{B}$ 是通过将 $\mathbf{A}$ 的一行的标量倍加到另一行（或一列的标量倍加到另一列）得到的，那么 $\det(\mathbf{B}) = \det(\mathbf{A})$。

行列式的一个进一步性质允许我们计算 $\mathbf{A}$ 的**逆 (inverse)**。定义矩阵 $\tilde{\mathbf{A}}$ 为 $\mathbf{A}$ 的**伴随矩阵 (adjoint)**：
$$
\tilde{\mathbf{A}} = \begin{bmatrix} c_{11} & \dots & c_{1m} \\ \vdots & \ddots & \vdots \\ c_{m1} & \dots & c_{mm} \end{bmatrix}^T \quad (21)
$$
其中 $c_{ij}$ 是 $\mathbf{A}$ 的代数余子式。根据 (19) 或 (20)，$\tilde{\mathbf{A}}$ 的第 $i$ 行 $\tilde{\mathbf{a}}_i^T$ 乘以第 $i$ 列 $\mathbf{a}_i$ 等于 $\det(\mathbf{A})$；即，
$$
\tilde{\mathbf{a}}_i^T \mathbf{a}_i = \det(\mathbf{A}), \quad i = 1, \dots, m. \quad (22)
$$
也可以证明
$$
\tilde{\mathbf{a}}_i^T \mathbf{a}_j = 0, \quad i \ne j. \quad (23)
$$
然后，将 (22) 和 (23) 对 $i, j \in \{1, \dots, m\}$ 结合起来，我们得到以下有趣的性质：
$$
\tilde{\mathbf{A}}\mathbf{A} = \det(\mathbf{A})\mathbf{I}, \quad (24)
$$
其中 $\mathbf{I}$ 是 $m \times m$ 的单位矩阵。从 (24) 可以得出，$\mathbf{A}$ 的逆 $\mathbf{A}^{-1}$ 由下式给出：
$$
\mathbf{A}^{-1} = [\det(\mathbf{A})]^{-1} \tilde{\mathbf{A}}. \quad (25)
$$

[^4]: 矩阵的特征多项式在第二章中定义。

[^5]: 标准正交矩阵在第二章中定义。

行列式的一个进一步性质允许我们计算 $\mathbf{A}$ 的**逆 (inverse)**。定义矩阵 $\tilde{\mathbf{A}}$ 为 $\mathbf{A}$ 的**伴随矩阵 (adjoint)**：
$$
\tilde{\mathbf{A}} = \begin{bmatrix} c_{11} & \dots & c_{1m} \\ \vdots & \ddots & \vdots \\ c_{m1} & \dots & c_{mm} \end{bmatrix}^T \quad (21)
$$
其中 $c_{ij}$ 是 $\mathbf{A}$ 的代数余子式。根据 (19) 或 (20)，$\tilde{\mathbf{A}}$ 的第 $i$ 行 $\tilde{\mathbf{a}}_i^T$ 乘以第 $i$ 列 $\mathbf{a}_i$ 等于 $\det(\mathbf{A})$；即，
$$
\tilde{\mathbf{a}}_i^T \mathbf{a}_i = \det(\mathbf{A}), \quad i = 1, \dots, m. \quad (22)
$$
也可以证明
$$
\tilde{\mathbf{a}}_i^T \mathbf{a}_j = 0, \quad i \ne j. \quad (23)
$$
然后，将 (22) 和 (23) 对 $i, j \in \{1, \dots, m\}$ 结合起来，我们得到以下有趣的性质：
$$
\tilde{\mathbf{A}}\mathbf{A} = \det(\mathbf{A})\mathbf{I}, \quad (24)
$$
其中 $\mathbf{I}$ 是 $m \times m$ 的单位矩阵。从 (24) 可以得出，$\mathbf{A}$ 的逆 $\mathbf{A}^{-1}$ 由下式给出：
$$
\mathbf{A}^{-1} = [\det(\mathbf{A})]^{-1} \tilde{\mathbf{A}}. \quad (25)
$$
无论是 (19) 还是 (25) 都不是计算行列式或逆矩阵的计算效率高的方法。利用各种矩阵分解性质的更好方法将在课程的后续部分变得显而易见。


## **2 第二讲**

本讲在随机过程的**卡尔胡宁-洛维 (Karhunen-Loeve, KL) 展开**背景下，讨论**特征值 (eigenvalues)** 和**特征向量 (eigenvectors)**。我们首先讨论特征值和特征向量的基本原理，然后转向**协方差矩阵 (covariance matrices)**。接着，将这两个主题结合到 K-L 展开中。最后，以一个**阵列信号处理 (array signal processing)** 领域的例子作为代数思想的应用。

本讲的一个主要目标是，通过展示特征值和特征向量在信号处理领域的一个非常重要的应用，来揭开其概念的神秘面纱。

### **2.1 特征值与特征向量**

假设我们有一个矩阵 $\mathbf{A}$：
$$
\mathbf{A} = \begin{bmatrix} 4 & 1 \\ 1 & 4 \end{bmatrix} \quad (1)
$$
我们来研究它的特征值和特征向量。



假设我们计算乘积 $\mathbf{Ax}_1$，其中 $\mathbf{x}_1 =^T$，如图1所示。
那么，
$$
\mathbf{Ax}_1 = \begin{bmatrix} 4 \\ 1 \end{bmatrix}. \quad (2)
$$
通过比较向量 $\mathbf{x}_1$ 和 $\mathbf{Ax}_1$，我们看到乘积向量相对于 $\mathbf{x}_1$ 既被缩放又被**逆时针 (counter-clockwise)** 旋转了。

现在考虑 $\mathbf{x}_2 =^T$ 的情况。那么 $\mathbf{Ax}_2 =^T$。这里，我们注意到 $\mathbf{Ax}_2$ 相对于 $\mathbf{x}_2$ 发生了**顺时针 (clockwise)** 旋转。

现在让我们来看一个更有趣的情况。假设 $\mathbf{x}_3 =^T$。那么 $\mathbf{A}\mathbf{x}_3 =^T$。现在，乘积向量与 $\mathbf{x}_3$ 指向**相同的方向**。向量 $\mathbf{Ax}_3$ 是向量 $\mathbf{x}_3$ 的一个缩放版本。因为这个性质，$\mathbf{x}_3 =^T$ 是 $\mathbf{A}$ 的一个**特征向量 (eigenvector)**。其缩放因子（在此例中为 5）用符号 $\lambda$ 表示，并被称为**特征值 (eigenvalue)**。

注意，$\mathbf{x} = [1, -1]^T$ 也是一个特征向量，因为在这种情况下，$\mathbf{Ax} = [3, -3]^T = 3\mathbf{x}$。对应的特征值是 3。

因此我们有，如果 $\mathbf{x}$ 是 $\mathbf{A} \in \mathbb{R}^{n \times n}$ 的一个特征向量，
$$
\mathbf{Ax} = \lambda\mathbf{x} \quad (3) \\
\uparrow \text{标量倍数 (eigenvalue)}
$$
即，向量 $\mathbf{Ax}$ 与 $\mathbf{x}$ 方向相同，但被一个因子 $\lambda$ 缩放。

现在我们已经理解了特征向量的基本思想，我们继续深入探讨。式 (3) 可以写成如下形式
$$
(\mathbf{A} - \lambda\mathbf{I})\mathbf{x} = \mathbf{0} \quad (4)
$$
其中 $\mathbf{I}$ 是 $n \times n$ 的单位矩阵。式 (4) 是一个齐次线性方程组，根据基础线性代数知识，我们知道 (4) 存在非平凡解的充要条件是
$$
\det(\mathbf{A} - \lambda\mathbf{I}) = 0 \quad (5)
$$
其中 $\det(\cdot)$ 表示行列式。当计算式 (5) 时，它会成为一个关于 $\lambda$ 的 $n$ 次多项式。例如，对于上面的矩阵 $\mathbf{A}$，我们有
$$
\det \left( \begin{bmatrix} 4 & 1 \\ 1 & 4 \end{bmatrix} - \lambda \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \right) = 0
$$
$$
\det \begin{bmatrix} 4 - \lambda & 1 \\ 1 & 4 - \lambda \end{bmatrix} = (4 - \lambda)^2 - 1
$$
$$
= \lambda^2 - 8\lambda + 15 = 0. \quad (6)
$$
很容易验证，这个多项式的根是 (5, 3)，这与上面指出的特征值相对应。

式 (5) 被称为 $\mathbf{A}$ 的**特征方程 (characteristic equation)**，而对应的多项式被称为**特征多项式 (characteristic polynomial)**。特征多项式的次数是 $n$。

更一般地，如果 $\mathbf{A}$ 是 $n \times n$ 矩阵，那么 (5) 有 $n$ 个解，即特征多项式有 $n$ 个根。因此，$\mathbf{A}$ 有 $n$ 个满足 (3) 的特征值；即
$$
\mathbf{A}\mathbf{x}_i = \lambda_i\mathbf{x}_i, \quad i = 1, \dots, n. \quad (7)
$$
如果特征值都是**互异的 (distinct)**，那么存在 $n$ 个相关的**线性无关的 (linearly-independent)** 特征向量，它们的方向是唯一的，并且张成一个 $n$ 维欧几里得空间。

**重复特征值 (Repeated Eigenvalues):** 在有例如 $r$ 个重复特征值的情况下，只要矩阵 $(\mathbf{A} - \lambda\mathbf{I})$ 在 (5) 中的秩为 $n-r$，那么仍然存在一个由 $n$ 个线性无关的特征向量组成的集合。此时，与重复特征值相关的 $r$ 个特征向量的方向不是唯一的。

事实上，考虑与 $r$ 个重复特征值相关的一组 $r$ 个线性无关的特征向量 $\mathbf{v}_1, \dots, \mathbf{v}_r$。可以证明，在 $\text{span}[\mathbf{v}_1, \dots, \mathbf{v}_r]$ 中的任何向量也是一个特征向量。这强调了在这种情况下特征向量不是唯一的事实。

**示例 1：** 考虑矩阵
$$
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}
$$
可以很容易地验证，在 $\text{span}[\mathbf{e}_2, \mathbf{e}_3]$ 中的任何向量都是与零重复特征值相关联的特征向量。

**示例 2：** 考虑 $n \times n$ 的单位矩阵。它有 $n$ 个等于 1 的重复特征值。在这种情况下，任何 $n$ 维向量都是一个特征向量，并且这些特征向量张成一个 $n$ 维空间。

---
式 (5) 为我们提供了如何计算特征值的线索。我们可以构建特征多项式并求解其根以得到 $\lambda_i$。一旦特征值可用，就可以通过计算量 $\mathbf{A} - \lambda_i\mathbf{I}$ 的零空间来计算相应的特征向量 $\mathbf{v}_i$，其中 $i=1, \dots, n$。这种方法对于小型系统是足够的，但对于规模可观的系统，该方法容易产生显著的数值误差。稍后，我们将考虑各种正交变换，这些变换可以引出更有效的寻找特征值的技术。

现在我们介绍特征值和特征向量的一些非常有趣的性质，以帮助我们理解。

**性质 1** 如果一个（厄米特）[^6]对称矩阵的特征值是互异的，那么其特征向量是**正交的 (orthogonal)**。

**证明：** 令 $\{\mathbf{v}_i\}$ 和 $\{\lambda_i\}$, $i = 1, \dots, n$ 分别是 $\mathbf{A} \in \mathbb{R}^{n \times n}$ 的特征向量和对应的特征值。选择任意 $i, j \in [1, \dots, n], i \neq j$。
那么
$$
\mathbf{A}\mathbf{v}_i = \lambda_i\mathbf{v}_i \quad (8)
$$
并且
$$
\mathbf{A}\mathbf{v}_j = \lambda_j\mathbf{v}_j. \quad (9)
$$
用 $\mathbf{v}_j^T$ 左乘 (8) 式，用 $\mathbf{v}_i^T$ 左乘 (9) 式：
$$
\mathbf{v}_j^T \mathbf{A}\mathbf{v}_i = \lambda_i\mathbf{v}_j^T \mathbf{v}_i \quad (10)
$$
$$
\mathbf{v}_i^T \mathbf{A}\mathbf{v}_j = \lambda_j\mathbf{v}_i^T \mathbf{v}_j \quad (11)
$$
当 $\mathbf{A}$ 是对称矩阵时，左边的量是相等的。我们如下证明这一点。由于 (10) 的左边是一个标量，它的转置等于它自身。因此，我们得到 $\mathbf{v}_j^T \mathbf{A}\mathbf{v}_i = \mathbf{v}_i^T \mathbf{A}^T \mathbf{v}_j$。[^7]但是，由于 $\mathbf{A}$ 是对称的，$\mathbf{A}^T = \mathbf{A}$。因此，$\mathbf{v}_j^T \mathbf{A}\mathbf{v}_i = \mathbf{v}_i^T \mathbf{A}^T \mathbf{v}_j = \mathbf{v}_i^T \mathbf{A}\mathbf{x}_j$，证毕。

从 (11) 中减去 (10)，我们得到
$$
(\lambda_i - \lambda_j)\mathbf{v}_j^T \mathbf{v}_i = 0 \quad (12)
$$
这里我们用到了 $\mathbf{v}_j^T \mathbf{v}_i = \mathbf{v}_i^T \mathbf{v}_j$。但根据假设，$\lambda_i - \lambda_j \neq 0$。因此，(12) 式只有在 $\mathbf{v}_j^T \mathbf{v}_i = 0$ 时才成立，这意味着向量是正交的。
$\square$

这里我们只考虑了特征值互异的情况。如果一个特征值 $\tilde{\lambda}$ 重复了 $r$ 次，并且 $\text{rank}(\mathbf{A} - \tilde{\lambda}\mathbf{I}) = n-r$，那么仍然可以找到一组由 $n$ 个相互正交的特征向量组成的集合。

对称矩阵特征值的另一个有用性质如下：

**性质 2** 一个（厄米特）对称矩阵的特征值是**实数 (real)**。

**证明：**[^8] (通过反证法)：首先，我们考虑 $\mathbf{A}$ 是实数矩阵的情况。令 $\lambda$ 是对称矩阵 $\mathbf{A}$ 的一个非零复数特征值。那么，由于 $\mathbf{A}$ 的元素是实数，$\lambda^*$，即 $\lambda$ 的复共轭，也必须是 $\mathbf{A}$ 的一个特征值，因为特征多项式的根必须成共轭对出现。同样，如果 $\mathbf{v}$ 是对应于 $\lambda$ 的一个非零特征向量，那么对应于 $\lambda^*$ 的特征向量必须是 $\mathbf{v}^*$，即 $\mathbf{v}$ 的复共轭。但是性质 1 要求特征向量是正交的；因此，$\mathbf{v}^T \mathbf{v}^* = 0$。但是 $\mathbf{v}^T \mathbf{v}^* = (\mathbf{v}^H\mathbf{v})^*$，根据定义，它是向量 $\mathbf{v}$ 范数的复共轭。但向量的范数是一个纯实数；因此，$\mathbf{v}^T \mathbf{v}^*$ 必须大于零，因为根据假设 $\mathbf{v}$ 是非零的。因此我们得出了一个矛盾。由此可见，对称矩阵的特征值不能是复数；即，它们是实数。

虽然这个证明只考虑了实对称情况，但它很容易推广到 $\mathbf{A}$ 是厄米特对称的情况。
$\square$

**性质 3** 设 $\mathbf{A}$ 是一个矩阵，其特征值为 $\lambda_i, i=1, \dots, n$，特征向量为 $\mathbf{v}_i$。那么矩阵 $\mathbf{A} + s\mathbf{I}$ 的特征值为 $\lambda_i + s$，对应的特征向量为 $\mathbf{v}_i$，其中 $s$ 是任意实数。

**证明：** 从特征向量的定义，我们有 $\mathbf{Av} = \lambda\mathbf{v}$。此外，我们有 $s\mathbf{Iv} = s\mathbf{v}$。相加得到 $(\mathbf{A} + s\mathbf{I})\mathbf{v} = (\lambda + s)\mathbf{v}$。这个关于矩阵 $(\mathbf{A} + s\mathbf{I})$ 的新特征向量关系表明，特征向量不变，而特征值移动了 $s$。
$\square$

**性质 4** 设 $\mathbf{A}$ 是一个 $n \times n$ 矩阵，其特征值为 $\lambda_i, i=1, \dots, n$。那么
*   行列式 $\det(\mathbf{A}) = \prod_{i=1}^{n} \lambda_i$。
*   迹[^9] $\text{tr}(\mathbf{A}) = \sum_{i=1}^{n} \lambda_i$。

证明是直接的，但使用后续课程中介绍的概念会更容易，因此这里不给出。

**性质 5** 如果 $\mathbf{v}$ 是矩阵 $\mathbf{A}$ 的一个特征向量，那么 $c\mathbf{v}$ 也是一个特征向量，其中 $c$ 是任意实数或复数常量。

证明通过将 $c\mathbf{v}$ 代替 $\mathbf{v}$ 到 $\mathbf{Av} = \lambda\mathbf{v}$ 中直接得出。这意味着特征向量的方向可以是唯一的，但其范数不是唯一的。

#### **2.1.1 标准正交矩阵 (Orthonormal Matrices)**

在进行矩阵的特征分解之前，我们必须建立**标准正交矩阵 (orthonormal matrix)** 的概念。这种形式的矩阵具有相互正交的列，且每一列的范数为单位1。这意味着
$$
\mathbf{q}_i^T \mathbf{q}_j = \delta_{ij}, \quad (13)
$$
其中 $\delta_{ij}$ 是克罗内克符号，$\mathbf{q}_i$ 和 $\mathbf{q}_j$ 是标准正交矩阵 $\mathbf{Q}$ 的列。记住 (13) 式，我们现在考虑乘积 $\mathbf{Q}^T\mathbf{Q}$。结果可以通过下图来形象化：
$$
\mathbf{Q}^T\mathbf{Q} = \begin{bmatrix} \mathbf{q}_1^T \rightarrow \\ \mathbf{q}_2^T \rightarrow \\ \vdots \\ \mathbf{q}_N^T \rightarrow \end{bmatrix} \begin{bmatrix} & & & \\ \mathbf{q}_1 & \mathbf{q}_2 & \cdots & \mathbf{q}_N \\ \downarrow & \downarrow & & \downarrow \end{bmatrix} = \mathbf{I}. \quad (14)
$$
（当 $i=j$ 时，量 $\mathbf{q}_i^T\mathbf{q}_i$ 定义了 $\mathbf{q}_i$ 的 2-范数的平方，我们已定义其为 1。当 $i \neq j$ 时，由于 $\mathbf{q}_i$ 的正交性，$\mathbf{q}_i^T\mathbf{q}_j = 0$）。式 (14) 是标准正交矩阵的一个基本性质。

因此，对于一个标准正交矩阵，(14) 意味着其逆矩阵可以通过简单地取矩阵的转置来计算，这个操作几乎不需要计算量。

式 (14) 直接源于 $\mathbf{Q}$ 具有标准正交列的事实。但 $\mathbf{Q}\mathbf{Q}^T$ 是否也等于单位矩阵就不那么明显了。我们可以用以下方式解决这个问题。假设 $\mathbf{A}$ 和 $\mathbf{B}$ 是任意两个方阵可逆矩阵，使得 $\mathbf{AB} = \mathbf{I}$。那么，$\mathbf{BAB} = \mathbf{B}$。通过解析这个最后的表达式，我们有
$$
(\mathbf{BA}) \cdot \mathbf{B} = \mathbf{B}. \quad (15)
$$
显然，要使 (15) 成立，量 $\mathbf{BA}$ 必须是单位矩阵[^10]；因此，如果 $\mathbf{AB} = \mathbf{I}$，那么 $\mathbf{BA} = \mathbf{I}$。所以，如果 $\mathbf{Q}^T\mathbf{Q} = \mathbf{I}$，那么 $\mathbf{Q}\mathbf{Q}^T = \mathbf{I}$ 也成立。由此可见，如果一个矩阵有标准正交的列，那么它也必须有标准正交的行。我们现在阐述标准正交矩阵的另一个有用性质：

**性质 6** 向量 2-范数在标准正交变换下是**不变的 (invariant)**。

如果 $\mathbf{Q}$ 是标准正交的，那么
$$
||\mathbf{Qx}||_2^2 = \mathbf{x}^T \mathbf{Q}^T \mathbf{Qx} = \mathbf{x}^T \mathbf{x} = ||\mathbf{x}||_2^2.
$$
因此，因为范数不变，标准正交变换对向量执行的是**旋转 (rotation)** 操作。我们在后续研究最小二乘问题时会使用这个范数不变性。

假设我们有一个矩阵 $\mathbf{U} \in \mathbb{R}^{m \times n}$，其中 $m > n$，其列是标准正交的。我们看到在这种情况下 $\mathbf{U}$ 是一个高矩阵，可以通过从任意标准正交矩阵中仅提取前 $n$ 列来形成。（我们保留术语**标准正交矩阵**来指代一个完整的 $m \times m$ 矩阵）。因为 $\mathbf{U}$ 有标准正交的列，所以 $\mathbf{U}^T\mathbf{U} = \mathbf{I}_{n \times n}$。然而，重要的是要意识到，在这种情况下，量 $\mathbf{U}\mathbf{U}^T \neq \mathbf{I}_{m \times m}$，这与 $m=n$ 的情况形成对比。后一种关系源于这样一个事实，即 $\mathbf{U}^T$ 的 $m$ 个长度为 $n$ 的列向量，在 $n < m$ 的情况下，不可能全部相互正交。事实上，我们稍后会看到 $\mathbf{U}\mathbf{U}^T$ 是到子空间 $R(\mathbf{U})$ 上的一个**投影算子 (projector)**。

假设我们有一个向量 $\mathbf{b} \in \mathbb{R}^m$。按照惯例，我们最容易用基 $[\mathbf{e}_1, \dots, \mathbf{e}_m]$ 来表示 $\mathbf{b}$，其中 $\mathbf{e}_i$ 是基本向量（在第 $i$ 个位置为 1，其余全为零）。然而，通常很方便地用由标准正交矩阵 $\mathbf{Q}$ 的列形成的基来表示 $\mathbf{b}$。在这种情况下，向量 $\mathbf{c} = \mathbf{Q}^T\mathbf{b}$ 的元素是 $\mathbf{b}$ 在基 $\mathbf{Q}$ 中的系数。标准正交基之所以方便，是因为我们可以通过计算 $\mathbf{b} = \mathbf{Qc}$ 简单地从 $\mathbf{c}$ 中恢复 $\mathbf{b}$。

标准正交矩阵有时被称为**酉矩阵 (unitary matrix)**。这是因为标准正交矩阵的行列式是 $\pm 1$。

#### **2.1.2 方形对称矩阵的特征分解 (ED)**

几乎所有执行 ED 的矩阵（至少在信号处理中）都是对称的。一个很好的例子是协方差矩阵，我们将在下一节详细讨论。

令 $\mathbf{A} \in \mathbb{R}^{n \times n}$ 是对称的。那么，对于特征值 $\lambda_i$ 和特征向量 $\mathbf{v}_i$，我们有
$$
\mathbf{A}\mathbf{v}_i = \lambda_i\mathbf{v}_i, \quad i = 1, \dots, n. \quad (16)
$$
设特征向量被归一化为单位 2-范数。那么这 $n$ 个方程可以被组合，或者并排堆叠在一起，并表示为以下紧凑形式：
$$
\mathbf{AV} = \mathbf{V\Lambda} \quad (17)
$$
其中 $\mathbf{V} = [\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_n]$（即 $\mathbf{V}$ 的每一列都是一个特征向量），并且
$$
\mathbf{\Lambda} = \begin{bmatrix} \lambda_1 & & & 0 \\ & \lambda_2 & & \\ & & \ddots & \\ 0 & & & \lambda_n \end{bmatrix} = \text{diag}(\lambda_1 \dots \lambda_n). \quad (18)
$$
(17) 式两边的对应列代表 (16) 式中索引 $i$ 的一个特定值。因为我们假设 $\mathbf{A}$ 是对称的，根据性质 1，$\mathbf{v}_i$ 是正交的。此外，由于我们假设 $||\mathbf{v}_i||_2 = 1$，$\mathbf{V}$ 是一个标准正交矩阵。因此，用 $\mathbf{V}^T$ 右乘 (17) 式的两边，并使用 $\mathbf{V}\mathbf{V}^T = \mathbf{I}$，我们得到
$$
\mathbf{A} = \mathbf{V\Lambda V}^T. \quad (19)
$$
式 (19) 被称为 $\mathbf{A}$ 的**特征分解 (eigendecomposition, ED)**。$\mathbf{V}$ 的列是 $\mathbf{A}$ 的特征向量，$\mathbf{\Lambda}$ 的对角元素是对应的特征值。任何对称矩阵都可以用这种方式分解。这种分解形式，其中 $\mathbf{\Lambda}$ 是对角矩阵，具有极大的意义和许多有趣的推论。正是这种分解直接引出了我们稍后讨论的卡尔胡宁-洛维展开。

注意，从 (19) 式可知，$\mathbf{A}$ 的特征值和特征向量的知识足以完全确定 $\mathbf{A}$。还要注意，如果特征值是互异的，那么 ED 是**唯一的 (unique)**。只有一个标准正交矩阵 $\mathbf{V}$ 和一个对角矩阵 $\mathbf{\Lambda}$ 满足 (19)。

式 (19) 也可以写成
$$
\mathbf{V}^T\mathbf{AV} = \mathbf{\Lambda}. \quad (20)
$$
由于 $\mathbf{\Lambda}$ 是对角矩阵，我们说由特征向量组成的酉（标准正交）矩阵 $\mathbf{V}$ **对角化 (diagonalizes)** 了 $\mathbf{A}$。没有其他的标准正交矩阵可以对角化 $\mathbf{A}$。**只有 $\mathbf{V}$ 能够对角化 $\mathbf{A}$** 是特征向量的基本性质。如果你理解了对称矩阵的特征向量可以将其对角化，那么你就理解了特征值和特征向量背后的“神秘”。这就是全部内容。我们将在本讲后面研究 K-L 展开，以巩固这种解释，并展示一些从 K-L 思想中引出的非常重要的信号处理概念。但是 K-L 分析只是对称矩阵的特征向量能够将其对角化这一事实的直接结果。

#### **2.1.3 关于特征值索引的常规表示法**

令 $\mathbf{A} \in \mathbb{R}^{n \times n}$ 的秩为 $r \le n$。同时假设 $\mathbf{A}$ 是**半正定的 (positive semi-definite)**；即，其所有特征值都 $\ge 0$。这个假设限制不大，因为大多数与特征分解相关的矩阵都是半正定的。然后，我们在下一节看到我们有 $r$ 个非零特征值和 $n-r$ 个零特征值。通常的惯例是对特征值进行排序，使得
$$
\underbrace{\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_r}_{r \text{ 个非零特征值}} > \underbrace{\lambda_{r+1} = \dots, \lambda_n}_{n-r \text{ 个零特征值}} = 0 \quad (21)
$$
即，我们对 (17) 式的列进行重新排序，使得 $\lambda_1$ 是最大的，其余非零特征值按降序排列，然后是 $n-r$ 个零特征值。注意，如果 $\mathbf{A}$ 是满秩的，那么 $r=n$，没有零特征值。量 $\lambda_n$ 是值最小的特征值。

特征向量被重新排序以对应于特征值的排序。为方便记法，我们称对应于最大特征值的特征向量为“最大特征向量”。“最小特征向量”则是对应于最小特征值的特征向量。

### **2.2 特征分解与基本矩阵子空间的关系**

在本节中，我们阐述矩阵的特征分解与其值域、零空间和秩之间的关系。

在这里，我们考虑秩为 $r \le n$ 的方形对称半正定矩阵 $\mathbf{A} \in \mathbb{R}^{n \times n}$。让我们将 $\mathbf{A}$ 的特征分解划分为以下形式：
$$
\mathbf{A} = \mathbf{V\Lambda V}^T = \underset{r \ \ n-r}{\begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix}} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{\Lambda}_2 \end{bmatrix} \underset{r \ \ n-r}{\begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix}} \quad (22)
$$
其中
$$
\mathbf{V}_1 = [\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_r] \in \mathbb{R}^{n \times r}
$$
$$
\mathbf{V}_2 = [\mathbf{v}_{r+1}, \dots, \mathbf{v}_n] \in \mathbb{R}^{n \times (n-r)}, \quad (23)
$$
$\mathbf{V}_1$ 的列是对应于 $\mathbf{A}$ 的前 $r$ 个特征值的特征向量，$\mathbf{V}_2$ 的列对应于 $n-r$ 个最小的特征值。

我们还有
$$
\mathbf{\Lambda}_1 = \text{diag}[\lambda_1, \dots, \lambda_r] = \begin{bmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_r \end{bmatrix} \in \mathbb{R}^{r \times r}, \quad (24)
$$
并且
$$
\mathbf{\Lambda}_2 = \begin{bmatrix} \lambda_{r+1} & & \\ & \ddots & \\ & & \lambda_n \end{bmatrix} \in \mathbb{R}^{(n-r) \times (n-r)}. \quad (25)
$$
在上述表示法中，非对角位置上明确缺少的矩阵元素意味着该元素为零。我们现在展示划分 (22) 揭示了关于 $\mathbf{A}$ 结构的大量信息。

#### **2.2.1 零空间 (Nullspace)**

在本节中，我们探讨划分 (22) 与 $\mathbf{A}$ 的零空间之间的关系。回想一下，$\mathbf{A}$ 的零空间 $N(\mathbf{A})$ 定义为
$$
N(\mathbf{A}) = \{ \mathbf{x} \in \mathbb{R}^n, \mathbf{x} \neq \mathbf{0} \ | \ \mathbf{Ax} = \mathbf{0} \}. \quad (26)
$$
从 (22) 式，我们有
$$
\mathbf{Ax} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{\Lambda}_2 \end{bmatrix} \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}. \quad (27)
$$
我们现在选择 $\mathbf{x}$ 使得 $\mathbf{x} \in \text{span}(\mathbf{V}_2)$。那么 $\mathbf{x} = \mathbf{V}_2\mathbf{c}_2$，其中 $\mathbf{c}_2$ 是 $\mathbb{R}^{n-r}$ 中的任意向量。又因为 $\mathbf{V}_1 \perp \mathbf{V}_2$，我们有
$$
\mathbf{Ax} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{\Lambda}_2 \end{bmatrix} \begin{bmatrix} \mathbf{0} \\ \mathbf{c}_2 \end{bmatrix} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{0} \\ \mathbf{\Lambda}_2\mathbf{c}_2 \end{bmatrix}. \quad (28)
$$
从 (28) 式可以清楚地看到，当且仅当 $\mathbf{\Lambda}_2 = \mathbf{0}$ 时，我们可以找到一个非平凡的 $\mathbf{x}$ 使得 $\mathbf{Ax} = \mathbf{0}$。因此，一个非空的零空间只有在 $\mathbf{\Lambda}_2 = \mathbf{0}$ 时才能存在。

由于 $\mathbf{\Lambda}_2 \in \mathbb{R}^{(n-r) \times (n-r)}$，一个秩为 $r \le n$ 的方形对称矩阵必须有 $n-r$ 个零特征值。

此外，从 (28) 我们看到，条件 $\mathbf{x} \in \text{span}\mathbf{V}_2$ 也是 $\mathbf{Ax} = \mathbf{0}$ 的必要条件。这意味着 $\mathbf{A}$ 的零空间的一个标准正交基是 $\mathbf{V}_2$。由于 $\mathbf{V}_2 \in \mathbb{R}^{n \times (n-r)}$，$\mathbf{A}$ 的**零度 (nullity)** 是 $n-r$，对应于零特征值的数量。

因此，我们有一个重要的结果：如果 $N(\mathbf{A})$ 的维度是 $d=n-r$，那么 $\mathbf{A}$ 必须有 $d$ 个零特征值。矩阵 $\mathbf{V}_2 \in \mathbb{R}^{n \times (n-r)}$ 是 $N(\mathbf{A})$ 的一个标准正交基。

#### **2.2.2 值域 (Range)**

让我们结合分解 (22) 来考察 $R(\mathbf{A})$，我们已经看到如果 $\mathbf{A}$ 是秩亏的，那么 $\mathbf{\Lambda}_2 = \mathbf{0}$。$R(\mathbf{A})$ 的定义，为方便起见在此重复：
$$
R(\mathbf{A}) = \{ \mathbf{y} \ | \ \mathbf{y} = \mathbf{Ax}, \mathbf{x} \in \mathbb{R}^n \}. \quad (29)
$$
向量量 $\mathbf{Ax}$ 因此可以表示为
$$
\mathbf{Ax} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}. \quad (30)
$$
在上面，可以理解的是，如果 $\mathbf{A}$ 是满秩的，那么 $\mathbf{\Lambda}$ 中右下角的零块消失，$\mathbf{\Lambda}$ 变为等价于 $\mathbf{\Lambda}_1$。

让我们定义 $\mathbf{c}$ 如下
$$
\mathbf{c} = \begin{bmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{bmatrix} = \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}, \quad (31)
$$
其中 $\mathbf{c}_1 \in \mathbb{R}^r$ 且 $\mathbf{c}_2 \in \mathbb{R}^{n-r}$。那么，
$$
\mathbf{y} = \mathbf{Ax} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{bmatrix}.
$$
$$
= \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1\mathbf{c}_1 \\ \mathbf{0} \end{bmatrix}
$$
$$
= \mathbf{V}_1 (\mathbf{\Lambda}_1\mathbf{c}_1). \quad (32)
$$
从 (31) 式，我们看到 $\text{span}(\mathbf{x}) = \text{span}(\mathbf{c})$，因此 $\text{span}(\mathbf{\Lambda}_1\mathbf{c}_1) = \mathbb{R}^r$。因此，(32) 式中的向量 $\mathbf{y}$ 由 $\mathbf{V}_1$ 的列的所有可能的线性组合构成，且 $R(\mathbf{A}) = R(\mathbf{V}_1)$。因此我们有了一个重要的结果，即 **$\mathbf{V}_1$ 是 $R(\mathbf{A})$ 的一个标准正交基**。

[^6]: **对称矩阵 (symmetric matrix)** 指的是 $\mathbf{A} = \mathbf{A}^T$，其中上标 $T$ 表示转置，即对于对称矩阵，元素 $a_{ij} = a_{ji}$。**厄米特对称 (Hermitian symmetric)**（或简称**厄米特**）矩阵仅与复数情况相关，指的是 $\mathbf{A} = \mathbf{A}^H$，其中上标 $H$ 表示厄米特转置。这意味着矩阵先转置再复共轭。因此对于厄米特矩阵，元素 $a_{ij} = a_{ji}^*$。在本课程中，我们通常只考虑实数矩阵。然而，当考虑复数矩阵时，厄米特对称将替代对称的含义。

[^7]: 在这里，我们使用了对于维度相容的矩阵或向量 $\mathbf{A}$ 和 $\mathbf{B}$，有 $(\mathbf{AB})^T = \mathbf{B}^T\mathbf{A}^T$ 的性质。

[^8]: 来自 Lastman 和 Sinha 的《Microcomputer-based Numerical Methods for Science and Engineering》。

[^9]: 方阵的**迹 (trace)**，记作 $\text{tr}(\cdot)$，是其主对角线（也称为“对角线”）上元素的总和。

[^10]: 这仅在 $\mathbf{A}$ 和 $\mathbf{B}$ 是方阵可逆时成立。

### **2.3 矩阵范数 (Matrix Norms)**

现在我们对特征向量和特征值有了一定的理解，接下来可以介绍**矩阵范数 (matrix norm)**。矩阵范数与向量范数相关：它是一个将 $\mathbb{R}^{m \times n}$ 映射到 $\mathbb{R}$ 的函数。矩阵范数必须遵循与向量范数相同的性质。由于范数严格来说只为向量量定义，矩阵范数是通过将矩阵映射为向量来定义的。这是通过将矩阵与一个合适的向量进行后乘法实现的。下面介绍一些有用的矩阵范数：

**矩阵 p-范数 (Matrix p-Norms):** 矩阵 p-范数是根据向量 p-范数定义的。任意矩阵 $\mathbf{A}$ 的矩阵 p-范数，记作 $||\mathbf{A}||_p$，定义为
$$
||\mathbf{A}||_p = \sup_{\mathbf{x} \neq \mathbf{0}} \frac{||\mathbf{Ax}||_p}{||\mathbf{x}||_p} \quad (33)
$$
其中，“sup”表示**上确界 (supremum)**；即，在所有 $\mathbf{x} \neq \mathbf{0}$ 的值上，参数的最大值。由于向量范数的一个性质是 $||c\mathbf{x}||_p = |c| ||\mathbf{x}||_p$ 对于任何标量 $c$ 都成立，我们可以在 (33) 中选择 $c$ 使得 $||\mathbf{x}||_p = 1$。那么，与 (33) 等价的表述是
$$
||\mathbf{A}||_p = \max_{||\mathbf{x}||_p=1} ||\mathbf{Ax}||_p. \quad (34)
$$
我们现在为 $p=2$ 且 $\mathbf{A}$ 为方形对称矩阵的特定情况，根据 $\mathbf{A}$ 的特征分解，对上述定义进行一些解释。为了找到矩阵 2-范数，我们对 (34) 求导并令结果为零。直接对 $||\mathbf{Ax}||_2$ 求导是困难的。然而，我们注意到找到使 $||\mathbf{Ax}||_2$ 最大化的 $\mathbf{x}$ 等价于找到使 $||\mathbf{Ax}||_2^2$ 最大化的 $\mathbf{x}$，而后者的求导要容易得多。在这种情况下，我们有 $||\mathbf{Ax}||_2^2 = \mathbf{x}^T \mathbf{A}^T \mathbf{A} \mathbf{x}$。为了找到最大值，我们使用拉格朗日乘子法，因为 $\mathbf{x}$ 受到 (34) 的约束。

因此，我们对量
$$
\mathbf{x}^T \mathbf{A}^T \mathbf{A} \mathbf{x} + \gamma(1 - \mathbf{x}^T\mathbf{x}) \quad (35)
$$
求导，并令结果为零。上面的量 $\gamma$ 是拉格朗日乘子。此处的求导细节被省略，因为它们将在后续的讲座中涵盖。这个过程的有趣结果是 $\mathbf{x}$ 必须满足
$$
\mathbf{A}^T \mathbf{A} \mathbf{x} = \gamma\mathbf{x}, \quad ||\mathbf{x}||_2 = 1. \quad (36)
$$
因此，(34) 的驻点是 $\mathbf{A}^T\mathbf{A}$ 的特征向量。当 $\mathbf{A}$ 是方形对称矩阵时，$\mathbf{A}^T\mathbf{A}$ 的特征向量等价于 $\mathbf{A}$ 的特征向量[^11]。因此，(34) 的驻点也是 $\mathbf{A}$ 的特征向量。通过将 $\mathbf{x} = \mathbf{v}_1$ 代入 (34)，我们发现 $||\mathbf{Ax}||_2 = \lambda_1$。

由此可见，(34) 的解由对应于 $\mathbf{A}$ 最大特征值的特征向量给出，并且 $||\mathbf{Ax}||_2$ 等于 $\mathbf{A}$ 的最大特征值。

更一般地，在下一讲中将显示，对于任意矩阵 $\mathbf{A}$，有
$$
||\mathbf{A}||_2 = \sigma_1 \quad (37)
$$
其中 $\sigma_1$ 是 $\mathbf{A}$ 的最大**奇异值 (singular value)**。这个量源于将在下一讲讨论的奇异值分解。

对于其他 $p$ 值的矩阵范数，对于任意 $\mathbf{A}$，由下式给出
$$
||\mathbf{A}||_1 = \max_{1 \le j \le n} \sum_{i=1}^{m} |a_{ij}| \quad (\text{最大列和}) \quad (38)
$$
和
$$
||\mathbf{A}||_\infty = \max_{1 \le i \le m} \sum_{j=1}^{n} |a_{ij}| \quad (\text{最大行和}). \quad (39)
$$

**弗罗贝尼乌斯范数 (Frobenius Norm):** 弗罗贝尼乌斯范数是由矩阵 $\mathbf{A}$ 的行（或列）的 2-范数组成的向量的 2-范数：
$$
||\mathbf{A}||_F = \left[ \sum_{i=1}^{m} \sum_{j=1}^{n} |a_{ij}|^2 \right]^{1/2}
$$

#### **2.3.1 矩阵范数的性质**

1. 考虑矩阵 $\mathbf{A} \in \mathbb{R}^{m \times n}$ 和向量 $\mathbf{x} \in \mathbb{R}^n$。那么，
$$
||\mathbf{Ax}||_p \le ||\mathbf{A}||_p ||\mathbf{x}||_p \quad (40)
$$
这个性质可以通过将上式两边除以 $||\mathbf{x}||_p$ 并应用 (33) 得出。
2. 如果 $\mathbf{Q}$ 和 $\mathbf{Z}$ 是适当大小的标准正交矩阵，那么
$$
||\mathbf{QAZ}||_2 = ||\mathbf{A}||_2 \quad (41)
$$
和
$$
||\mathbf{QAZ}||_F = ||\mathbf{A}||_F \quad (42)
$$
因此，我们看到矩阵 2-范数和弗罗贝尼乌斯范数在通过标准正交矩阵进行左乘和右乘时是不变的。
3. 此外，
$$
||\mathbf{A}||_F^2 = \text{tr}(\mathbf{A}^T\mathbf{A}) \quad (43)
$$
其中 $\text{tr}(\cdot)$ 表示**矩阵的迹 (trace of a matrix)**，即其**对角元素 (diagonal elements)** 的和。

### **2.4 协方差矩阵 (Covariance Matrices)**

在这里，我们研究与平稳离散时间随机过程 $x[n]$ 对应的**协方差矩阵 (covariance matrix)** $\mathbf{R}_{xx}$ 的概念和性质。我们将无限序列 $x[n]$ 分解为长度为 $m$ 的窗口，如图 2 所示。这些窗口通常是重叠的；实际上，它们通常只相互错开一个样本。第 $i$ 个窗口内的样本构成一个长度为 $m$ 的向量 $\mathbf{x}_i, i=1, 2, 3, \dots$。因此，每个窗口对应的向量是来自随机过程 $x[n]$ 的一个**向量样本 (vector sample)**。以这种方式处理随机信号是处理实际信号的许多电子系统的基本第一步，例如过程辨识、控制，或任何形式的通信系统，包括电话、无线电、雷达、声纳等。

上面使用的“**平稳 (stationary)**”一词意味着随机过程对应的联合 $m$ 维概率密度函数

图 2：接收信号 $x[n]$ 被分解为长度为 $m$ 的窗口。第 $i$ 个窗口中的样本构成向量 $\mathbf{x}_i, i=1, 2, \dots$。

描述向量样本 $\mathbf{x}$ 的分布不随时间改变。这意味着分布的所有矩（即，诸如均值、方差和所有互相关以及所有其他高阶统计特征）都是不随时间变化的。然而，在这里，我们处理一种较弱形式的平稳性，称为**宽义平稳 (wide-sense stationarity, WSS)**。对于这些过程，只需要前两个矩（均值、方差和协方差）不随时间变化。严格来说，协方差矩阵的概念只与平稳或 WSS 过程相关，因为只有当基础过程是平稳的时，期望才有意义。

对应于平稳或 WSS 过程 $x[n]$ 的协方差矩阵 $\mathbf{R}_{xx} \in \mathbb{R}^{m \times m}$ 定义为
$$
\mathbf{R}_{xx} \triangleq E\left[ (\mathbf{x} - \boldsymbol{\mu})(\mathbf{x} - \boldsymbol{\mu})^T \right] \quad (44)
$$
其中 $\boldsymbol{\mu}$ 是过程的向量均值，而 $E(\cdot)$ 表示在图 2 中所有长度为 $m$ 的索引 $i$ 的可能窗口上的**期望算子 (expectation operator)**。通常我们处理零均值过程，在这种情况下我们有
$$
\mathbf{R}_{xx} = E\left[ \mathbf{x}_i\mathbf{x}_i^T \right] = E \begin{bmatrix} \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_m \end{pmatrix} \begin{pmatrix} x_1 & x_2 & \cdots & x_m \end{pmatrix} \end{bmatrix}
$$
$$
= E \begin{bmatrix} x_1x_1 & x_1x_2 & \cdots & x_1x_m \\ x_2x_1 & x_2x_2 & \cdots & x_2x_m \\ \vdots & \vdots & \ddots & \vdots \\ x_mx_1 & x_mx_2 & \cdots & x_mx_m \end{bmatrix}, \quad (45)
$$
其中 $(x_1, x_2, \dots, x_m)^T = \mathbf{x}_i$。对所有窗口取期望，式 (45) 告诉我们 $\mathbf{R}_{xx}$ 的元素 $r(1, 1)$ 根据定义是 $E(x_1^2)$，这是过程的所有可能向量样本 $\mathbf{x}_i$ 的第一个元素 $x_1$ 的均方值（首选术语是**方差 (variance)**，其符号是 $\sigma^2$）。但由于平稳性，$r(1, 1) = r(2, 2) = \dots, = r(m, m)$，它们都等于 $\sigma^2$。因此，**$\mathbf{R}_{xx}$ 的所有主对角线元素都等于过程的方差**。元素 $r(1, 2) = E(x_1x_2)$ 是 $\mathbf{x}_i$ 的第一个元素和第二个元素之间的**互相关 (cross-correlation)**。在所有可能的窗口上取值，我们看到这个量是过程与其自身延迟一个样本的互相关。由于平稳性，$r(1, 2) = r(2, 3) = \dots = r(m-1, m)$，因此第一上对角线上的所有元素都等于一个样本时滞的互相关。由于乘法是可交换的，$r(2, 1) = r(1, 2)$，因此第一下对角线上的所有元素也都等于这个相同的互相关值。使用类似的推理，第 $j$ 个上对角线或下对角线上的所有元素都等于过程在 $j$ 个样本时滞下的互相关值。因此我们看到矩阵 $\mathbf{R}_{xx}$ 是高度结构化的。

让我们将图 2 中所示的过程与图 3 中所示的过程进行比较。在前一种情况下，我们看到过程变化相对缓慢。因为我们假设 $x[n]$ 是零均值的，图 2 中过程的相邻样本在大多数时候会具有相同的符号，因此 $E(x_ix_{i+1})$ 将是一个正数，接近于 $E(x_i^2)$ 的值。对于 $E(x_ix_{i+2})$ 也是如此，只是它不那么接近 $E(x_i^2)$。因此，我们看到对于图 2 的过程，对角线上的值会随着远离主对角线而相当缓慢地衰减。

然而，对于图 3 所示的过程，相邻样本彼此不相关。这意味着相邻样本具有相反符号的可能性与具有相同符号的可能性一样大。平均而言，具有正值的项与具有负值的项具有相同的幅度。因此，当取期望 $E(x_ix_{i+1}), E(x_ix_{i+2}), \dots$ 时，得到的平均值接近于零。在这种情况下，我们看到协方差矩阵集中在主对角线周围，并变为等于 $\sigma^2\mathbf{I}$。我们注意到**$\mathbf{R}_{xx}$ 的所有特征值都等于值 $\sigma^2$**。由于这个特性，这样的过程被称为“**白 (white)**”，类比于白光，其光谱分量都具有相等的幅度。

序列 $\{r(1, 1), r(1, 2), \dots, r(1, m)\}$ 等价于过程在 0 到 $m-1$ 时滞下的**自相关函数 (autocorrelation function)**。过程的自相关函数以其方差和过程随时间变化的快慢来表征该随机过程。事实上，可以证明[^12]自相关函数的傅里叶变换是过程的**功率谱密度 (power spectral density)**。关于随机过程这方面的进一步讨论超出了本处理的范围；感兴趣的读者可以参考相关文献。

在实践中，使用如 (44) 中的期望来评估协方差矩阵 $\mathbf{R}_{xx}$ 是不可能的。期望在实践中无法评估——它们需要无限量的数据，而这是永远无法获得的，此外，数据必须在观测区间内是平稳的，而这种情况很少发生。在实践中，我们基于对过程 $x[n]$ 的有限长度 $N$ 的观测，通过用在 $N$ 个可用数据点上的有限时间平均来代替系综平均（期望），来评估 $\mathbf{R}_{xx}$ 的一个**估计 (estimate)** $\mathbf{\hat{R}}_{xx}$，如下所示[^13]：
$$
\mathbf{\hat{R}}_{xx} = \frac{1}{N - m + 1} \sum_{i=1}^{N-m+1} \mathbf{x}_i\mathbf{x}_i^T. \quad (46)
$$
如果使用 (46) 来评估 $\mathbf{\hat{R}}$，那么该过程只需要在观测长度上是平稳的。因此，通过使用 (46) 给出的协方差估计，我们可以跟踪过程的真实协方差矩阵随时间的缓慢变化，只要过程在观测区间 $N$ 内的变化很小。Haykin[^14]给出了协方差矩阵的进一步性质和讨论。

有趣的是，$\mathbf{\hat{R}}_{xx}$ 也可以通过另一种方式由 (46) 形成。令 $\mathbf{X} \in \mathbb{R}^{m \times (N-m+1)}$ 是一个矩阵，其第 $i$ 列是 $x[n]$ 的向量样本 $\mathbf{x}_i, i=1, \dots, N-m+1$。那么 $\mathbf{\hat{R}}_{xx}$ 也由下式给出
$$
\mathbf{\hat{R}}_{xx} = \frac{1}{N - m + 1} \mathbf{XX}^T. \quad (47)
$$
**该陈述的证明留作练习。**

图 3：一个不相关的离散时间过程

$\mathbf{R}_{xx}$ 的一些性质：
1.  $\mathbf{R}_{xx}$ 是（厄米特）对称的，即 $r_{ij} = r_{ji}^*$，其中 $*$ 表示复共轭。
2.  如果过程 $x[n]$ 是平稳或宽义平稳的，那么 $\mathbf{R}_{xx}$ 是**托普利兹 (Toeplitz)** 矩阵。这意味着矩阵的任何给定对角线上的所有元素都相等。如果你理解了这个性质，那么你就对协方差矩阵的性质有了很好的理解。
3.  如果 $\mathbf{R}_{xx}$ 是对角的，那么 $\mathbf{x}$ 的元素是不相关的。如果 $\mathbf{R}_{xx}$ 的非对角元素相对于主对角线上的元素的大小是显著的，那么该过程被称为**高度相关 (highly correlated)**。
4.  $\mathbf{R}$ 是**半正定的 (positive semi-definite)**。这意味着所有的特征值都大于或等于零。我们将在后面讨论正定性和半正定性。
5.  如果平稳或 WSS 随机过程 $\mathbf{x}$ 具有高斯概率分布，那么向量均值和协方差矩阵 $\mathbf{R}_{xx}$ 就足以完全指定该过程的统计特性。

### **2.5 随机过程的卡尔胡宁-洛维展开**

在本节中，我们将我们所学的关于特征值和特征向量以及协方差矩阵的知识，结合到随机过程的 **K-L 正交展开 (K-L orthonormal expansion)** 中。K-L 展开在图像和语音信号的**压缩 (compression)** 中非常有用。

向量 $\mathbf{x} \in \mathbb{R}^m$ 的正交展开涉及将 $\mathbf{x}$ 表示为正交基向量或函数的线性组合，如下所示：
$$
\mathbf{x} = \mathbf{Qa} \quad (48)
$$
其中 $\mathbf{a} = [a_1, \dots, a_m]$ 包含展开的系数或权重，而 $\mathbf{Q} = [\mathbf{q}_1 \dots \mathbf{q}_m]$ 是一个 $m \times m$ 的正交矩阵。[^15] 因为 $\mathbf{Q}$ 是**正交的 (orthonormal)**，我们可以写出
$$
\mathbf{a} = \mathbf{Q}^T\mathbf{x}. \quad (49)
$$
系数 $\mathbf{a}$ 在一个坐标系中表示 $\mathbf{x}$，该坐标系的轴是基 $[\mathbf{q}_1 \dots \mathbf{q}_m]$，而不是传统的基 $[\mathbf{e}_1, \dots, \mathbf{e}_m]$。通过使用不同的基函数 $\mathbf{Q}$，我们可以生成具有不同性质的系数集。例如，我们可以将离散傅里叶变换 (DFT) 表示为 (49) 的形式，其中 $\mathbf{Q}$ 的列是谐波相关的旋转指数。使用这个基，系数 $\mathbf{a}$ 告诉我们 $\mathbf{x}$ 中包含了多少对应于 $\mathbf{q}_i$ 的频率。

对于每个向量观测 $\mathbf{x}_i$，矩阵 $\mathbf{Q}$ 保持不变，但会生成一个新的系数向量 $\mathbf{a}_i$。为了强调这一点，我们将 (48) 重写为
$$
\mathbf{x}_i = \mathbf{Qa}_i, \quad i=1, \dots, N \quad (50)
$$
其中 $i$ 是**向量样本索引 (vector sample index)**（对应于图 2 中的窗口位置），$N$ 是向量观测的数量。

[^11]: 这个证明留作练习。

[^12]: A. Papoulis，《概率、随机变量和随机过程》，McGraw Hill，第 3 版。

[^13]: 具有此性质的过程被称为**遍历 (ergodic)** 过程。

[^14]: Haykin，《自适应滤波器理论》，Prentice Hall，第 3 版。

[^15]: $\mathbf{x}$ 的展开通常只需要基向量是线性无关的——不一定是标准正交的。但标准正交基向量最常用，因为它们可以用 (49) 的非常简单的形式进行求逆。

#### **2.5.1 K-L展开的推导**

图 4 展示了与图 2 所示类型的**缓慢变化随机过程 (slowly-varying random process)** 对应的散点图。散点图是点的集合，其中第 $i$ 个点是对应于向量 $\mathbf{x}_i$ 在 $m$ 维平面上的点。由于绘图的明显限制，我们在这里限制 $m=2$。因为我们选择的过程在这种情况下是缓慢变化的，所以 $\mathbf{x}_i$ 的元素是**高度相关的 (highly correlated)**；也就是说，知道一个元素就意味着对另一个元素的值有很大的了解。这迫使散点图呈椭圆形状（在更高维度上是椭球体），集中在 $x_1-x_2$ 平面的主对角线方向。设量 $a_1, a_2, \dots, a_m$ 是散点图椭圆的 $m$ 个主轴的长度。对于高度相关的过程，我们发现 $a_1 > a_2 > \dots > a_m$。通常我们发现在更高维系统中，当过程高度相关时，$a_i$ 的值随着 $i$ 的增加而迅速减小。

为了对比，图 5 展示了一个类似的散点图，但其基础随机过程是白噪声。这里，过程的相邻样本之间没有相关性，因此在这种情况下，散点图没有对角线集中。这个散点图是一个 $m$ 维的球体。

图 4：向量 $\mathbf{x}_i \in \mathbb{R}^2$ 的散点图，对应于与图 2 所示高度相关（在此情况下为缓慢变化）的随机过程。每个点代表一个单独的向量样本，其中其第一个元素 $x_1$ 相对于第二个元素 $x_2$ 绘制。

图 5：与图 4 类似，但基础随机过程是白噪声。

正如我们稍后在本节中看到的，如果我们希望存储或传输这样的随机过程，当过程高度相关时，使用传统的坐标系 $[\mathbf{e}_1, \mathbf{e}_2, \dots, \mathbf{e}_m]$ 是浪费的。（使用传统坐标系传输等同于按顺序传输 $\mathbf{x}_i$ 的元素 $x_1, x_2, \dots, x_m$）。这种低效率是由于这样一个事实，即给定样本 $x_j$ 中包含的大部分信息必须在相邻和后续样本中重新传输。在本节中，我们寻求一个在这方面更有效的**变换坐标系 (transformed coordinate system)**。其动机将在本节末尾变得更加清晰。

寻找一个最优坐标系来表示我们的随机过程的建议方法是，找到一个基向量 $\mathbf{q}_1 \in \mathbb{R}^m$，使得对应的系数 $a_1 = \mathbf{q}_1^T\mathbf{x}$ 具有最大可能的**均方值 (mean-squared value)**（方差）。然后，我们找到第二个基向量 $\mathbf{q}_2$，它被约束为与 $\mathbf{q}_1$ **正交 (orthogonal)**，使得系数 $a_2 = \mathbf{q}_2^T\mathbf{x}$ 的方差最大。我们以这种方式继续，直到我们获得一个完整的**正交基 (orthonormal basis)** $\mathbf{Q} = [\mathbf{q}_1, \dots, \mathbf{q}_m]$。从直观上看，我们从图 8 中看到，所期望的基是散点图椭圆的**主轴 (principal axes)** 集合。当我们应用这项技术来压缩随机过程时，这个过程的好处将变得更加清晰。

确定 $\mathbf{q}_i$ 的过程是直接的。基向量 $\mathbf{q}_1$ 由以下问题的解给出：
$$
\mathbf{q}_1 = \arg \max_{||\mathbf{q}||_2=1} E\left[ |\mathbf{q}^T\mathbf{x}_i|^2 \right] \quad (51)
$$
其中期望是在 $i$ 的所有值上取的。对 $\mathbf{q}$ 的 2-范数的约束是为了防止解趋于无穷大。式 (51) 可以写成
$$
\mathbf{q}_1 = \arg \max_{||\mathbf{q}||_2=1} E\left[ \mathbf{q}^T\mathbf{xx}^T\mathbf{q} \right]
$$
$$
= \arg \max_{||\mathbf{q}||_2=1} \mathbf{q}^T E\left[ \mathbf{xx}^T \right] \mathbf{q}
$$
$$
= \arg \max_{||\mathbf{q}||_2=1} \mathbf{q}^T\mathbf{R}_{xx}\mathbf{q}. \quad (52)
$$
这里我们假设了一个零均值过程。上面的优化问题与 2.3 节中矩阵范数的问题完全相同，其中显示了 (52) 中参数的**驻点 (stationary points)** 是 $\mathbf{R}_{xx}$ 的特征向量。因此，(52) 的解是 $\mathbf{q}_1 = \mathbf{v}_1$，即 $\mathbf{R}_{xx}$ 的最大特征向量。类似地，$\mathbf{q}_2, \dots, \mathbf{q}_m$ 是 $\mathbf{R}_{xx}$ 的其余依次递减的特征向量。因此，所期望的正交矩阵是对应于随机过程协方差矩阵的特征向量矩阵 $\mathbf{V}$。以这种方式分解向量 $\mathbf{x}$ 被称为**卡尔胡宁-洛维 (Karhunen Loeve, KL) 展开**。

在下文中，K-L 展开使用以下表示法：
$$
\mathbf{x}_i = \mathbf{V\theta}_i \quad (53)
$$
和
$$
\boldsymbol{\theta}_i = \mathbf{V}^T\mathbf{x}_i, \quad (54)
$$
其中 $\mathbf{V} \in \mathbb{R}^{m \times m}$ 是特征向量的正交矩阵，它是 K-L 展开的基，而 $\boldsymbol{\theta}_i \in \mathbb{R}^m$ 是 K-L 系数的向量。

因此，$\boldsymbol{\theta}$ 中的系数 $\theta_1$ 平均包含 $\boldsymbol{\theta}$ 中所有系数中最大的能量（方差）；$\theta_2$ 是包含次高方差的系数，依此类推。系数 $\theta_m$ 包含最小的方差。这与传统坐标系形成对比，在传统坐标系中，所有轴都具有相等的方差。

到第四讲，我们将有足够的知识来证明特征向量沿着图 4 的散点图椭球体的主轴对齐。在高度相关的系统中，由于散点图椭圆的主轴具有递减的幅度（如图 4 所示），最小系数的方差通常远小于较大系数的方差。

**问题：** 假设过程 $\mathbf{x}$ 是白噪声，因此 $\mathbf{R}_{xx} = E(\mathbf{xx}^T)$ 已经是具有相等对角元素的对角矩阵；即，$\mathbf{R}_{xx} = \sigma^2\mathbf{I}$，如图 5 所示。这种情况下的 K-L 基是什么？

要回答这个问题，我们看到 $\mathbf{R}_{xx}$ 的所有特征值都是重复的。因此，特征向量基不是唯一的。事实上，在这种情况下，$\mathbb{R}^m$ 中的**任何 (any)** 向量都是矩阵 $\sigma^2\mathbf{I}$ 的特征向量（特征值为 $\sigma^2$）。因此，任何正交基都是白噪声过程的 K-L 基。这个概念从图 5 的圆形散点图中可以明显看出。

#### **2.5.2 K-L 展开的性质**

**性质 7** K-L 展开的系数 $\boldsymbol{\theta}$ 是**不相关的 (uncorrelated)**。

为了证明这一点，我们使用定义 (54) 来评估 $\boldsymbol{\theta}$ 的协方差矩阵 $\mathbf{R}_{\theta\theta}$，如下所示：
$$
\mathbf{R}_{\theta\theta} = E\left[ \boldsymbol{\theta}\boldsymbol{\theta}^T \right]
$$
$$
= E\left[ \mathbf{V}^T\mathbf{xx}^T\mathbf{V} \right]
$$
$$
= \mathbf{V}^T\mathbf{R}_{xx}\mathbf{V}
$$
$$
= \mathbf{\Lambda}. \quad (55)
$$
由于 $\mathbf{R}_{\theta\theta}$ 等于 $\mathbf{R}_{xx}$ 的对角特征值矩阵 $\mathbf{\Lambda}$，K-L 系数是不相关的。

**性质 8** 第 $i$ 个 K-L 系数 $\theta_i$ 的方差等于 $\mathbf{R}_{xx}$ 的第 $i$ 个特征值 $\lambda_i$。
这个证明直接从 (55) 得出；$\mathbf{R}_{\theta\theta} = \mathbf{\Lambda}$。

**性质 9** 高度相关随机过程 $\mathbf{x}$ 的方差集中在前几个 K-L 系数中。

这个性质可以从图 4 的散点图中直观地证明，因为第一主轴的长度大于第二主轴的长度。（这种效应在更高维度上变得更加明显。）然而，在这里我们希望正式地证明这个性质。

我们用 $\mathbf{R}_2$ 表示图 2 所示过程的协方差矩阵，用 $\mathbf{R}_3$ 表示图 3 所示过程的协方差矩阵。我们假设两个过程都是平稳的且具有相等的功率。令 $\alpha_i$ 为 $\mathbf{R}_2$ 的特征值，$\beta_i$ 为 $\mathbf{R}_3$ 的特征值。因为 $\mathbf{R}_3$ 是对角矩阵且具有相等的对角元素，所有的 $\beta_i$ 都相等。我们的假设意味着 $\mathbf{R}_2$ 的主对角线元素等于 $\mathbf{R}_3$ 的主对角线元素，因此根据性质 4，每个协方差矩阵的迹和特征值总和是相等的。

为了进一步深入了解这两组特征值的行为，我们考虑**哈达玛不等式 (Hadamard's inequality)**[^16]，它可以表述为：
> 考虑一个方阵 $\mathbf{A} \in \mathbb{R}^{m \times m}$。那么，$\det \mathbf{A} \le \prod_{i=1}^{m} a_{ii}$，
> 等号成立当且仅当 $\mathbf{A}$ 是对角矩阵。

根据哈达玛不等式，$\det \mathbf{R}_2 < \det \mathbf{R}_3$，因此也根据性质 4，$\prod_{i=1}^{n} \alpha_i < \prod_{i=1}^{n} \beta_i$。在约束 $\sum \alpha_i = \sum \beta_i$ 下，可以得出 $\alpha_1 > \alpha_n$；即 $\mathbf{R}_2$ 的特征值不相等。（我们说特征值变得**离散 (disparate)**）。因此，相关过程的前几个 K-L 系数的方差大于后几个 K-L 系数的方差。通常在一个高度相关的系统中，只有前几个系数具有显著的方差。

为了进一步说明这种现象，考虑一个极端情况，即过程变得如此相关，以至于其协方差矩阵的所有元素都趋于相同的值。（如果过程 $x[n]$ 不随时间变化，就会发生这种情况）。那么，协方差矩阵的所有列都相等，这种情况下 $\mathbf{R}_{xx}$ 的秩变为 1，因此只有一个非零特征值。那么过程的所有能量都集中在第一个 K-L 系数中。相比之下，当过程是白噪声且平稳时，$\mathbf{R}_{xx}$ 的所有特征值都相等，过程的方差在所有 K-L 系数中均匀分布。这个讨论的要点是指出随机过程的一个普遍行为，即随着它们变得越来越相关，K-L 系数的方差集中在前几个元素中。剩余系数的方差变得可以忽略不计。

#### **2.5.3 K-L 展开的应用**

假设一个通信系统传输一个平稳、零均值、高度相关的序列 $\mathbf{x}$。这意味着要直接传输 $\mathbf{x}$ 的元素，需要用足够多的比特来发送 $\mathbf{x}$ 的特定元素 $x_i$，以传达所需保真度的信息。然而，在发送下一个元素 $x_{i+1}$ 时，几乎所有的相同信息都被再次发送，因为 $x_{i+1}$ 与 $x_i$ 及其前几个样本高度相关。也就是说，$x_{i+1}$ 相对于 $x_i$ 包含的新信息非常少。因此可以看出，如果 $\mathbf{x}$ 是高度相关的，直接传输样本（即，使用传统坐标系）在所需传输比特数方面是非常浪费的。

但是如果 $\mathbf{x}$ 是平稳的并且 $\mathbf{R}_{xx}$ 在接收端是已知的[^17]，那么发射端和接收端都可以“知道” $\mathbf{R}_{xx}$ 的特征向量，即基集。如果过程足够高度相关，那么由于 K-L 变换的集中特性，前几个系数 $\boldsymbol{\theta}$ 的方差将主导其余系数的方差。后几个系数平均而言通常具有很小的方差，不需要精确地表示信号。

为了实现这种形式的信号压缩，假设我们通过只保留前 $j$ 个重要系数来获得可接受的失真水平。我们以类似于 (54) 的方式形成一个截断的 K-L 系数向量 $\boldsymbol{\hat{\theta}}$：
$$
\boldsymbol{\hat{\theta}} = \begin{bmatrix} \theta_1 \\ \vdots \\ \theta_j \\ 0 \\ \vdots \\ 0 \end{bmatrix} = \begin{bmatrix} \mathbf{v}_1^T \\ \vdots \\ \mathbf{v}_j^T \\ \mathbf{0}^T \\ \vdots \\ \mathbf{0}^T \end{bmatrix} \mathbf{x}. \quad (56)
$$
其中系数 $\theta_{j+1}, \dots, \theta_m$ 被设为零，因此不需要传输。这意味着我们可以更紧凑地表示 $\mathbf{x}_i$ 而不会牺牲显著的质量损失；即，我们实现了信号压缩。

原始信号的近似 $\mathbf{\hat{x}}$ 可以通过以下方式重构：
$$
\mathbf{\hat{x}} = \mathbf{V}\boldsymbol{\hat{\theta}}. \quad (57)
$$
根据性质 8，K-L 重构 $\mathbf{\hat{x}}$ 中的**均方误差 (mean-squared error)** $\epsilon_j$ 由下式给出
$$
\epsilon_j = \sum_{i=j+1}^{m} \lambda_i, \quad (58)
$$
它对应于被截断的（最小的）特征值的总和。很容易证明没有其他基能产生更小的误差。使用任何基 $[\mathbf{q}_1, \dots, \mathbf{q}_m]$ 重构的 $\mathbf{\hat{x}}$ 中的误差 $\epsilon_j$ 由下式给出
$$
\epsilon_j = \sum_{i=j+1}^{m} E|\mathbf{q}_i^T\mathbf{x}|_2^2 = \sum_{i=j+1}^{m} \mathbf{q}_i^T\mathbf{R}_{xx}\mathbf{q}_i. \quad (59)
$$
其中最后一行使用了 (51) 和 (52)。我们之前已经看到特征向量是上面和中每一项的驻点。由于和中的每一项都是半正定的，通过最小化每一项可以使 $\epsilon_j$ 最小化。因此，当 $\mathbf{q}_i$ 被分配为 $m-j$ 个最小的特征向量时，(59) 的最小值就获得了。由于当 $||\mathbf{v}||_2=1$ 时 $\mathbf{v}_i^T\mathbf{R}_{xx}\mathbf{v}_i = \lambda_i$，只有当 $\mathbf{q}_i = \mathbf{v}_i$ 时 $\epsilon_j = \epsilon'_j$。这就完成了证明。

例如，在语音应用中，只需要不到十分之一的系数就可以实现几乎无法察觉的降级重构。注意，由于 $\mathbf{\hat{R}}_{xx}$ 是半正定的，所有特征值都是非负的。因此，能量度量 (58) 对于任何 $j$ 值都是非负的。这种类型的信号压缩是被称为**变换编码 (transform coding)** 的一种编码的最终形式。

[^16]: 证明请参考 Cover 和 Thomas 的《信息论基础》。

[^17]: 这不一定是一个有效的假设。我们将在本节后面进一步讨论这一点。

现在通过一个例子来说明变换编码。一个过程 $x[n]$ 是通过将一个单位方差、零均值的白噪声序列 $w(n)$ 通过一个三阶低通数字巴特沃斯滤波器生成的，该滤波器具有相对较低的归一化截止频率（0.1 Hz），如图 6 所示。向量样本 $\mathbf{x}_i$ 从序列 $x[n]$ 中提取，如图 2 所示。该滤波器从输入中移除了高频分量，因此产生的输出过程 $x[n]$ 必须随时间缓慢变化。因此，K-L 展开预计只需要少数几个主要特征向量分量，并且可以实现显著的压缩增益。

图 6：生成高度相关过程 x[n]

我们以 $m=10$ 为例进行展示。下面列出了由低通滤波器输出生成的 $\mathbf{x}$ 的协方差矩阵 $\mathbf{\hat{R}}_{xx}$ 对应的 10 个特征值：

**特征值：**
```
0.5468
0.1975
0.1243 × 10⁻¹
0.5112 × 10⁻³
0.2617 × 10⁻⁴
0.1077 × 10⁻⁵
0.6437 × 10⁻⁷
0.3895 × 10⁻⁸
0.2069 × 10⁻⁹
0.5761 × 10⁻¹¹
```

图 7：巴特沃斯低通滤波噪声示例中，前两个特征向量分量作为时间的函数。

因此，对于 $j=2$ 的误差 $\epsilon'_j$ 从上述数据计算为 0.0130，这可以与总特征值和 0.7573 进行比较。归一化误差为 $\frac{0.0130}{0.7573} = 0.0171$。因为这个误差可以被认为是足够小的值，所以只有前 $j=2$ 个 K-L 分量可以被认为是显著的。在这种情况下，我们的压缩增益为 $10/2 = 5$；即，K-L 展开只需要相对于直接表示信号的五分之一的比特。

对应的两个**主要特征向量 (principal eigenvectors)** 绘制在图 7 中。这些图显示了特征向量的第 $k$ 个元素 $v_k$ 的值，相对于其索引 $k$（$k=1, \dots, m$）进行绘制。这些波形可以解释为时间的函数。

在这种情况下，我们期望任何观测值 $\mathbf{x}_i$ 都可以精确地表示为图 7 所示的前两个特征向量波形的线性组合，其系数 $\boldsymbol{\hat{\theta}}$ 由 (56) 给出。在图 8 中，我们展示了作为时间波形的真实观测值 $\mathbf{x}$ 的样本，与仅使用前 $j=2$ 个特征向量由 (57) 形成的重构 $\mathbf{\hat{x}}_i$ 进行比较。可以看出，真实和重构的向量样本之间的差异很小，正如预期的那样。

图 8：原始向量样本 $\mathbf{x}$ 作为时间的函数（实线），与其仅使用前两个特征向量分量（点线）的重构进行比较。图中显示了三个向量样本。

在编码中使用 K-L 展开的一个实际困难是，在实际情况下，当观测信号是轻度或严重非平稳时（例如语音或视频信号），特征向量集 $\mathbf{V}$ 通常在接收端是未知的。在这种情况下，协方差矩阵估计 $\mathbf{\hat{R}}_{xx}$ 会随时间变化；因此特征向量也会变化。将特征向量集传输到接收端在信息方面是昂贵的，因此是不可取的。这一事实限制了 K-L 展开在编码中的明确使用。然而，已经证明[^18]，**离散余弦变换 (discrete cosine transform, DCT)**，这是另一种形式的正交展开，其基由余弦相关函数组成，对于某一大类信号，可以很好地近似特征向量基。DCT 使用固定的、与信号无关的基，因此在接收端总是已知的。使用 DCT 的变换编码得到了广泛的实际应用，并且是所谓的 JEPEG 和 MPEG 国际图像和视频编码标准背后的基本思想。寻找其他基，特别是小波函数，来替代特征向量基是一个正在进行的研究课题。因此，即使 K-L 展开本身没有太多的实际价值，其背后的理论思想也具有重要的价值。

### **2.6 示例：阵列处理**

在这里，我们提供了我们迄今为止所发展的概念的进一步示例。这个例子关注的是使用传感器阵列进行**到达方向 (direction of arrival)** 估计。

考虑一个由 $M$ 个传感器（例如天线）组成的阵列，如图 9 所示。假设有 $K < M$ 个平面波入射到该阵列上。假设入射波的幅度在波穿越阵列所需的时间内不发生变化。同时暂时假设第一个入射波在第一个传感器处的幅度为 1。那么，根据图 9 所示的物理原理，仅由第一个入射波，通过同时采样阵列的每个元素接收到的信号向量 $\mathbf{x}$，可以用向量格式描述为 $\mathbf{x} = [1, e^{j\phi}, e^{j2\phi}, \dots, e^{j(M-1)\phi}]^T$，其中 $\phi$ 是由于第一个入射波，阵列相邻元素之间的电相移。[^19] 当有 $K$ 个入射信号，具有相应的幅度 $a_k, k=1, \dots, K$ 时，$K$ 个入射信号的效应各自线性相加，每个信号都由相应的幅度 $a_k$ 加权，形成接收信号向量 $\mathbf{x}$。由此产生的接收信号向量，包括噪声，可以写成如下形式
$$
\mathbf{x}_n = \mathbf{S}\mathbf{a}_n + \mathbf{w}_n, \quad n=1, \dots, N, \quad (60) \\
(M \times 1) \quad (M \times K)(K \times 1) \quad (M \times 1)
$$
其中
$\mathbf{w}_n = $ 在时间 $n$ 的 $M$ 长度噪声向量，其元素是零均值和方差 $\sigma^2$ 的独立随机变量，即 $E(w_i^2) = \sigma^2$。向量 $\mathbf{w}$ 假设与信号不相关。
$\mathbf{S} = [\mathbf{s}_1 \dots \mathbf{s}_K]$
$\mathbf{s}_k = [1, e^{j\phi_k}, e^{j2\phi_k}, \dots, e^{j(M-1)\phi_k}]^T$ 被称为**导向向量 (steering vectors)**。
$\phi_k, k=1, \dots, K$ 是对应于入射信号的电相移角。$\phi_k$ 假设是互异的。
$\mathbf{a}_n = [a_1 \dots a_K]_n^T$ 是一个独立随机变量的向量，描述了在时间 $n$ 每个入射信号的幅度。

在 (60) 中，我们通过在 $N$ 个不同的时间点同时采样所有阵列元素，获得了 $N$ 个向量样本 $\mathbf{x}_n \in \mathbb{R}^{M \times 1}, n=1, \dots, N$。我们的目标是通过仅观察接收到的信号，来估计平面波相对于阵列的到达方向 $\phi_k$。

注意 $K < M$。让我们形成接收信号 $\mathbf{x}$ 的协方差矩阵 $\mathbf{R}$：
$$
\mathbf{R} = E(\mathbf{xx}^H) = E\left[ (\mathbf{Sa} + \mathbf{w})(\mathbf{a}^H\mathbf{S}^H + \mathbf{w}^H) \right]
$$
$$
= \mathbf{S}E(\mathbf{aa}^H)\mathbf{S}^H + \sigma^2\mathbf{I} \quad (61)
$$
最后一行是因为噪声与信号不相关，从而迫使交叉项为零。在 (61) 的最后一行，我们还利用了噪声贡献（第二项）的协方差矩阵是 $\sigma^2\mathbf{I}$ 的事实。这是因为噪声向量 $\mathbf{w}$ 的元素是具有相等功率的独立的。我们称 (61) 的第一项为 $\mathbf{R}_o$，这是仅由信号引起的协方差矩阵的贡献。

让我们看看 $\mathbf{R}_o$ 的结构：
$$
\mathbf{R}_o = \begin{bmatrix} & & K & & \\ & S & E(\mathbf{aa}^H) & S^H & \\ & & \uparrow \text{非奇异} & & \end{bmatrix}_M^K
$$
从这个结构中，我们可以得出结论，$\mathbf{R}_o$ 的秩为 $K$。这可以如下看出。我们定义 $\mathbf{A} \triangleq E(\mathbf{aa}^H)$ 和 $\mathbf{B} \triangleq \mathbf{AS}^H$。因为 $\phi_k$ 是互异的，$\mathbf{S}$ 是满秩（秩为 $K$），并且因为 $a_k$ 是独立的，$\mathbf{A}$ 是满秩（$K$）。因此矩阵 $\mathbf{B} \in \mathbb{R}^{K \times M}$ 是满秩 $K$。那么，$\mathbf{R}_o = \mathbf{SB}$。从这个最后的关系，我们可以看到 $\mathbf{R}_o$ 的第 $i$ 列，$i=1, \dots, M$ 是 $\mathbf{S}$ 的 $K$ 列的线性组合，其系数是 $\mathbf{B}$ 的第 $i$ 列。因为 $\mathbf{B}$ 是满秩的，所以使用了 $\mathbf{S}$ 的 $K$ 个线性无关的线性组合来形成 $\mathbf{R}_o$。因此 $\mathbf{R}_o$ 的秩为 $K$。因为 $K < M$，$\mathbf{R}_o$ 是秩亏的。

现在让我们研究 $\mathbf{R}_o$ 的特征分解，其中 $\lambda_k$ 是 $\mathbf{R}_o$ 的特征值：
$$
\mathbf{R}_o = \mathbf{V\Lambda V}^H \quad (62)
$$
或
$$
\mathbf{R}_o = \begin{bmatrix} \\ \\ \\ \end{bmatrix} \begin{bmatrix} \lambda_1 & & & & \\ & \ddots & & & \\ & & \lambda_K & & \\ & & & 0 & \\ & & & & \ddots & \\ & & & & & 0 \end{bmatrix} \begin{bmatrix} \\ \\ \\ \end{bmatrix}. \quad (63)
$$
因为 $\mathbf{R}_o \in \mathbb{R}^{M \times M}$ 的秩为 $K$，它有 $K$ 个非零特征值和 $M-K$ 个零特征值。我们将与最大 $K$ 个特征值相关的特征向量枚举为 $\mathbf{v}_1, \dots, \mathbf{v}_K$，并将与零特征值相关的特征向量枚举为 $\mathbf{v}_{K+1}, \dots, \mathbf{v}_M$。[^20] [^21]

从特征向量的定义，我们有
$$
\mathbf{R}_o\mathbf{v}_i = \mathbf{0} \quad (68)
$$
或
$$
\mathbf{SA}\mathbf{S}^H\mathbf{v}_i = \mathbf{0}, \quad i=K+1, \dots, M. \quad (69)
$$
由于 $\mathbf{A} = E(\mathbf{aa}^H)$ 和 $\mathbf{S}$ 都是满秩的，(69) 能够满足的唯一方式是如果 $\mathbf{v}_i, i=K+1, \dots, M$ 与 $\mathbf{S} = [\mathbf{s}(\phi_1), \dots, \mathbf{s}(\phi_K)]$ 的所有列都正交。因此我们有
$$
\mathbf{s}_k^H\mathbf{v}_i = 0, \quad k=1, \dots, K, \quad (70)
$$
$$
i=K+1, \dots, M,
$$
我们定义矩阵 $\mathbf{V}_N \triangleq [\mathbf{v}_{K+1}, \dots, \mathbf{v}_M]$。因此 (70) 可以写成
$$
\mathbf{S}^H\mathbf{V}_N = \mathbf{0}. \quad (71)
$$
我们还有
$$
[1, e^{j\phi_k}, e^{j2\phi_k}, \dots, e^{j(M-1)\phi_k}]^H \mathbf{V}_N = \mathbf{0}. \quad (72)
$$
到目前为止，我们只考虑了无噪声的情况。当噪声分量 $\sigma^2\mathbf{I}$ 被加到 $\mathbf{R}_o$ 上得到 (61) 中的 $\mathbf{R}_{xx}$ 时会发生什么？根据第一讲的性质 3，我们看到如果 $\mathbf{R}_o$ 的特征值是 $\lambda_i$，那么 $\mathbf{R}_{xx}$ 的特征值是 $\lambda_i + \sigma^2$。特征向量在有噪声贡献的情况下保持不变，并且 (70) 在有噪声存在时仍然成立。注意这些性质只适用于使用期望形成的真实协方差矩阵，而不是使用时间平均形成的估计协方差矩阵。

有了这些背景知识，我们现在可以讨论 **MUSIC**[^22] 算法，用于估计入射到传感器阵列上的平面波的到达方向。

#### **2.6.1 MUSIC 算法[^23]**

我们希望估计构成 $\mathbf{S} = [\mathbf{s}(\phi_1), \dots, \mathbf{s}(\phi_K)]$ 的未知值 $[\phi_1, \dots, \phi_K]$。MUSIC 算法假设量 $K$ 是已知的。在实际情况下，期望无法评估，因为它们需要无限的数据，我们基于有限数量的 $N$ 个观测值形成 $\mathbf{R}$ 的一个估计 $\mathbf{\hat{R}}$，如下所示：
$$
\mathbf{\hat{R}} = \frac{1}{N} \sum_{n=1}^{N} \mathbf{x}_n\mathbf{x}_n^H.
$$
只有当 $N \to \infty$ 时，$\mathbf{\hat{R}} \to \mathbf{R}$。

$\mathbf{V}_N$ 的一个估计 $\mathbf{\hat{V}}_N$ 可以由与 $\mathbf{\hat{R}}$ 的最小 $M-K$ 个特征值相关的特征向量形成。由于有限的 $N$ 和噪声的存在，(72) 只有在用 $\mathbf{\hat{V}}_N$ 代替 $\mathbf{V}_N$ 时才近似成立。因此，所需到达方向的合理估计可以通过找到变量 $\phi$ 的值来获得，使得 (72) 的左边表达式很小而不是完全为零。因此，我们确定 $K$ 个估计值 $\hat{\phi}$，它们局部满足
$$
\hat{\phi} = \arg \min_\phi || \mathbf{s}^H(\phi)\mathbf{\hat{V}}_N || \quad (73)
$$
按照惯例，希望将 (73) 表示为类似谱的函数，其中峰值而不是零点代表所需的信号。使用平方范数而不是范数本身也很方便。因此，MUSIC “谱” $P(\phi)$ 定义为：
$$
P(\phi) = \frac{1}{\mathbf{s}(\phi)^H\mathbf{\hat{V}}_N\mathbf{\hat{V}}_N^H\mathbf{s}(\phi)}
$$
当 $K=2$ 个入射信号时，它将看起来像图 10 中所示的样子。

图 10：K=2个信号时MUSIC谱P(φ)

### **2.7 总结**

*   矩阵 $\mathbf{A}$ 的一个特征向量 $\mathbf{x}$ 使得 $\mathbf{Ax}$ 指向与 $\mathbf{x}$ 相同的方向。
*   随机过程 $\mathbf{x}$ 的协方差矩阵 $\mathbf{R}_{xx}$ 定义为 $E(\mathbf{x}\mathbf{x}^H)$。对于平稳过程，$\mathbf{R}_{xx}$ 完全表征了该过程，并与其协方差函数密切相关。在实践中，期望操作被时间平均所取代。
*   $\mathbf{R}_{xx}$ 的特征向量形成了一个表示 $\mathbf{x}$ 的自然基，因为只有特征向量才能对角化 $\mathbf{R}_{xx}$。这导致了相应展开 $\mathbf{x} = \mathbf{Va}$ 的系数 $\mathbf{a}$ 是不相关的。这在语音/视频编码中有重要应用。
*   上述系数平方的期望是 $\mathbf{R}_{xx}$ 的特征值。这给出了沿每个特征向量存在的相对功率的概念。
*   如果变量 $\mathbf{x}$ 是高斯的，那么 K-L 系数是独立的。这大大简化了接收机的设计和分析。

这些要点中许多都是只有特征向量才能对角化矩阵这一事实的直接结果。这基本上是特征值/特征向量如此有用的唯一原因。我希望这有助于揭开这个主题的神秘面纱。一旦你看到只有特征向量才能对角化，那么它们是过程 $\mathbf{x}$ 的自然基这一性质就变得容易理解了。

特征值的一个解释是，它代表了 K-L 展开中每个系数的平均能量。

[^18]: K.R. Rao and P. Yip, "Discrete Cosine Transform– Algorithms, Advantages, Applications".

[^19]: 可以证明，如果 $d \le \lambda/2$，那么电角度 $\phi$ 和对应的物理角度 $\theta$ 之间存在一对一的关系。事实上，$\phi = \frac{2\pi d}{\lambda}\sin\theta$。我们只能观察到电角度 $\phi$，而不是期望的物理角度 $\theta$。因此，我们从这个数学关系中，从观察到的电角度推断出期望的物理角度。

[^20]: 注意，特征值零具有 $M-K$ 的多重性。因此，特征向量 $\mathbf{v}_{K+1}, \dots, \mathbf{v}_M$ 不是唯一的。然而，存在一组与其余特征向量正交的标准正交特征向量。因此我们可以像对待互异的特征向量一样对待零特征向量。

[^21]: 我们定义所谓的信号子空间 $S_S$ 为 $S_S = \text{span}[\mathbf{v}_1, \dots, \mathbf{v}_K]$ (64)，以及噪声子空间 $S_N$ 为 $S_N = \text{span}[\mathbf{v}_{K+1}, \dots, \mathbf{v}_M]$ (65)。我们现在简要讨论这两个子空间。根据我们上面的讨论，$\mathbf{R}_o$ 的所有列都是 $\mathbf{S}$ 的列的线性组合。因此，$\text{span}[\mathbf{R}_o] = \text{span}[\mathbf{S}]$ (66)。但也很容易验证 $\text{span}[\mathbf{R}_o] \in S_S$ (67)。比较 (66) 和 (67)，我们看到 $\mathbf{S} \in S_S$。从 (60) 我们看到，在没有噪声的情况下，任何接收到的信号向量 $\mathbf{x}$ 都是 $\mathbf{S}$ 的列的线性组合。因此，任何无噪声信号完全驻留在 $S_S$ 中。这就是“信号子空间”这个术语的来源。此外，接收信号的任何驻留在 $S_N$ 中的分量必须完全是由于噪声。这就是“噪声子空间”这个术语的来源。我们注意到信号和噪声子空间是彼此的正交补子空间。

[^22]: 这个词是**MUltiple SIgnal Classification**的首字母缩写。

[^23]: R.O. Schmidt, "Multiple emitter location and parameter estimation", IEEE Trans. Antennas and Propag., vol AP-34, Mar. 1986, pp 276-280.
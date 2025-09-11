# EE731 Lecture Notes: Matrix Computations for Signal Processing

> [!INFO]
> 原文档为 EE731 Lecture Notes: Matrix Computations for Signal Processing
> 
> James P. Reilly (c)
> 
> Department of Electrical and Computer Engineering, McMaster University
> 
> September 13, 2004

# 0 Preface

This collection of ten chapters of notes will give the reader an introduction to the fundamental principles of linear algebra for application in many disciplines of modern engineering and science, including signal processing, control theory, process control, applied statistics, robotics, etc. We assume the reader has an equivalent background to a freshman course in linear algebra, some introduction to probability and statistics, and a basic knowledge of the Fourier transform.

The first chapter, some fundamental ideas required for the remaining portion of the course are established. First, we look at some fundamental ideas of linear algebra such as linear independence, subspaces, rank, nullspace, range, etc., and how these concepts are interrelated. The idea of autocorrelation, and the covariance matrix of a signal, are then discussed and interpreted.

In chapter 2, the most basic matrix decomposition, the so-called eigendecomposition, is presented. The focus of the presentation is to give an intuitive insight into what this decomposition accomplishes. We illustrate how the eigendecomposition can be applied through the Karhunen-Loeve transform. In this way, the reader is made familiar with the important properties of this decomposition. The Karhunen-Loeve transform is then generalized to the broader idea of transform coding.

In chapter 3, we develop the *singular value decomposition (SVD)*, which is closely related to the eigendecomposition of a matrix. We develop the relationships between these two decompositions and explore various properties of the SVD.

Chapter 4 deals with the quadratic form and its relation to the eigendecomposition, and also gives an introduction to error mechanisms in floating point number systems. The condition number of a matrix, which is a critical part in determining a lower bound on the relative error in the solution of a system of linear equations, is also developed.

Chapters 5 and 6 deal with solving linear systems of equations by Gaussian elimination. The Gaussian elimination process is described through a bigger-block matrix approach, that leads to other useful decompositions, such as the Cholesky decomposition of a square symmetric matrix.

Chapters 7-10 deal with solving least-squares problems. The standard least squares problem and its solution are developed in Chapter 7. In Chapter 8, we develop a generalized "pseudoinverse" approach to solving the least-squares problem. The QR decomposition in developed in Chapter 9, and its application to the solution of linear least squares problems is discussed in Chapter 10.

Finally, in Chapter 11, the solution of Toeplitz systems of equations and its underlying theory is developed.

# 1 Fundamental Concepts
The purpose of this lecture is to review important fundamental concepts in linear algebra, as a foundation for the rest of the course. We first discuss the fundamental building blocks, such as an overview of matrix multiplication from a “big block” perspective, linear independence, subspaces and related ideas, rank, etc., upon which the rigor of linear algebra rests. We then discuss vector norms, and various interpretations of the matrix multiplication operation. We close the chapter with a discussion on determinants.

## 1.1 Notation
Throughout this course, we shall indicate that a matrix $\mathbf{A}$ is of dimension $m \times n$, and whose elements are taken from the set of real numbers, by the notation $\mathbf{A} \in \mathbb{R}^{m \times n}$. This means that the matrix $\mathbf{A}$ belongs to the Cartesian product of the real numbers, taken $m \times n$ times, one for each element of $\mathbf{A}$. In a similar way, the notation $\mathbf{A} \in \mathbb{C}^{m \times n}$ means the matrix is of dimension $m \times n$, and the elements are taken from the set of complex numbers. By the matrix dimension “$m \times n$”, we mean $\mathbf{A}$ consists of $m$ rows and $n$ columns.

Similarly, the notation $\mathbf{a} \in \mathbb{R}^m (\mathbb{C}^m)$ implies a vector of dimension $m$ whose elements are taken from the set of real (complex) numbers. By “dimension of a vector”, we mean its length, i.e., that it consists of $m$ elements.

Also, we shall indicate that a scalar $a$ is from the set of real (complex) numbers by the notation $a \in \mathbb{R}(\mathbb{C})$. Thus, an upper case bold character denotes a matrix, a lower case bold character denotes a vector, and a lower case non-bold character denotes a scalar.

By convention, a vector by default is taken to be a column vector. Further, for a matrix $\mathbf{A}$, we denote its $i$th column as $\mathbf{a}_i$. We also imply that its $j$th row is $\mathbf{a}_j^T$, even though this notation may be ambiguous, since it may also be taken to mean the transpose of the $j$th column. The context of the discussion will help to resolve the ambiguity.

## 1.2 “Bigger-Block” Interpretations of Matrix Multiplication
Let us define the matrix product $\mathbf{C}$ as
$$
\underset{m \times n}{\mathbf{C}} = \underset{m \times k}{\mathbf{A}} \underset{k \times n}{\mathbf{B}} \tag{1}
$$
The three interpretations of this operation now follow:

### 1.2.1 Inner-Product Representation
If $\mathbf{a}$ and $\mathbf{b}$ are column vectors of the same length, then the scalar quantity $\mathbf{a}^T\mathbf{b}$ is referred to as the *inner product* of $\mathbf{a}$ and $\mathbf{b}$. If we define $\mathbf{a}_i^T \in \mathbb{R}^k$ as the $i$th row of $\mathbf{A}$ and $\mathbf{b}_j \in \mathbb{R}^k$ as the $j$th column of $\mathbf{B}$, then the element $c_{ij}$ of $\mathbf{C}$ is defined as the inner product $\mathbf{a}_i^T \mathbf{b}_j$. This is the conventional small-block representation of matrix multiplication.

### 1.2.2 Column Representation
This is the next bigger–block view of matrix multiplication. Here we look at forming the product one column at a time. The $j$th column $\mathbf{c}_j$ of $\mathbf{C}$ may be expressed as a linear combination of columns $\mathbf{a}_i$ of $\mathbf{A}$ with coefficients which are the elements of the $j$th column of $\mathbf{B}$. Thus,
$$
\mathbf{c}_j = \sum_{i=1}^k \mathbf{a}_i b_{ij}, \quad j = 1, \dots, n. \tag{2}
$$
This operation is identical to the inner–product representation above, except we form the product one column at a time. For example, if we evaluate only the $p$th element of the $j$th column $\mathbf{c}_j$, we see that (2) degenerates into $\sum_{i=1}^k a_{pi}b_{ij}$. This is the inner product of the $p$th row and $j$th column of $\mathbf{A}$ and $\mathbf{B}$ respectively, which is the required expression for the $(p, j)$th element of $\mathbf{C}$.

### 1.2.3 Outer–Product Representation
This is the largest–block representation. Let us define a column vector $\mathbf{a} \in \mathbb{R}^m$ and a row vector $\mathbf{b}^T \in \mathbb{R}^n$. Then the *outer product* of $\mathbf{a}$ and $\mathbf{b}$ is an $m \times n$ matrix of rank one and is defined as $\mathbf{a}\mathbf{b}^T$.

Now let $\mathbf{a}_i$ and $\mathbf{b}_i^T$ be the $i$th column and row of $\mathbf{A}$ and $\mathbf{B}$ respectively. Then the product $\mathbf{C}$ may also be expressed as
$$
\mathbf{C} = \sum_{i=1}^k \mathbf{a}_i \mathbf{b}_i^T. \tag{3}
$$
By looking at this operation one column at a time, we see this form of matrix multiplication performs exactly the same operations as the column representation above. For example, the $j$th column $\mathbf{c}_j$ of the product is determined from (3) to be $\mathbf{c}_j = \sum_{i=1}^k \mathbf{a}_i b_{ij}$, which is identical to (2) above.

### 1.2.4 Matrix Pre– and Post–Multiplication
Let us now look at some fundamental ideas distinguishing matrix pre– and post–multiplication. In this respect, consider a matrix $\mathbf{A}$ *pre–multiplied* by $\mathbf{B}$ to give $\mathbf{Y} = \mathbf{B}\mathbf{A}$. (All matrices are assumed to have conformable dimensions). Then we can interpret this multiplication as $\mathbf{B}$ operating on the *columns* of $\mathbf{A}$ to give the columns of the product. This follows because each column $\mathbf{y}_i$ of the product is a transformed version of the corresponding column of $\mathbf{A}$; i.e., $\mathbf{y}_i = \mathbf{B}\mathbf{a}_i$, $i = 1, \dots, n$. Likewise, let’s consider $\mathbf{A}$ *post–multiplied* by a matrix $\mathbf{C}$ to give $\mathbf{X} = \mathbf{A}\mathbf{C}$. Then, we interpret this multiplication as $\mathbf{C}$ operating on the *rows* of $\mathbf{A}$, because each row $\mathbf{x}_j^T$ of the product is a transformed version of the corresponding row of $\mathbf{A}$; i.e., $\mathbf{x}_j^T = \mathbf{a}_j^T \mathbf{C}$, $j = 1, \dots, m$, where we define $\mathbf{a}_j^T$ as the $j$th row of $\mathbf{A}$.

**Example:**
- Consider an orthonormal matrix $\mathbf{Q}$ of appropriate dimension. We know that multiplication by an orthonormal matrix results in a rotation operation. The operation $\mathbf{Q}\mathbf{A}$ rotates each column of $\mathbf{A}$. The operation $\mathbf{A}\mathbf{Q}$ rotates each row.

There is another way to interpret pre– and post–multiplication. Again consider the matrix $\mathbf{A}$ pre–multiplied by $\mathbf{B}$ to give $\mathbf{Y} = \mathbf{B}\mathbf{A}$. Then according to (2), the $j$th column $\mathbf{y}_i$ of $\mathbf{Y}$ is a *linear combination of the columns of* $\mathbf{B}$, whose coefficients are the $j$th column of $\mathbf{A}$. Likewise, for $\mathbf{X} = \mathbf{A}\mathbf{B}$, we can say that the $i$th row $\mathbf{x}_i^T$ of $\mathbf{X}$ is a *linear combination of the rows of* $\mathbf{B}$, whose coefficients are the $i$th row of $\mathbf{A}$.

Either of these interpretations is equally valid. Being comfortable with the representations of this section is a big step in mastering the field of linear algebra.

## 1.3 Fundamental Linear Algebra
### 1.3.1 Linear Independence
Suppose we have a set of $n$ $m$-dimensional vectors $\{\mathbf{a}_1, \dots, \mathbf{a}_n\}$, where $\mathbf{a}_i \in \mathbb{R}^m, i = 1, \dots, n$. This set is linearly independent under the conditions [^chapter1-1]
$$
\sum_{j=1}^n c_j \mathbf{a}_j = \mathbf{0} \quad \text{if and only if} \quad c_1, \dots, c_n = 0 \tag{4}
$$
In words:
> Eq. (4) means that a set of vectors is linearly independent if and only if the only zero linear combination of the vectors has coefficents which are all zero.

A set of $n$ vectors is linearly independent if an $n$–dimensional space may be formed by taking all possible linear combinations of the vectors. If the dimension of the space is less than $n$, then the vectors are linearly dependent. The concept of a *vector space* and the *dimension* of a vector space is made more precise later.

Note that a set of vectors $\{\mathbf{a}_1, \dots, \mathbf{a}_n\}$, where $n > m$ cannot be linearly independent.

**Example 1**
$$
\mathbf{A} = [\mathbf{a}_1 \ \mathbf{a}_2 \ \mathbf{a}_3] = \begin{bmatrix} 1 & 2 & 1 \\ 0 & 3 & -1 \\ 0 & 0 & 1 \end{bmatrix} \tag{5}
$$
This set is linearly independent. On the other hand, the set
$$
\mathbf{B} = [\mathbf{b}_1 \ \mathbf{b}_2 \ \mathbf{b}_3] = \begin{bmatrix} 1 & 2 & -3 \\ 0 & 3 & -3 \\ 0 & 0 & 0 \end{bmatrix} \tag{6}
$$
is not. This follows because the third column is a linear combination of the first two. ($-1$ times the first column plus $-1$ times the second equals the third column. Thus, the coefficients $c_j$ in (4) resulting in zero are any scalar multiple of $(1, 1, 1)$).

### 1.3.2 Span, Range, and Subspaces
In this section, we explore these three closely-related ideas. In fact, their mathematical definitions are almost the same, but the interpretation is different for each case.

**Span:**
The span of a vector set $[\mathbf{a}_1, \dots, \mathbf{a}_n]$, written as $\text{span}[\mathbf{a}_1, \dots, \mathbf{a}_n]$, where $\mathbf{a}_i \in \mathbb{R}^m$, is the set of points mapped by
$$
\text{span} [\mathbf{a}_1, \dots, \mathbf{a}_n] = \left\{ \mathbf{y} \in \mathbb{R}^m \mid \mathbf{y} = \sum_{j=1}^n c_j \mathbf{a}_j, \quad c_j \in \mathbb{R} \right\}. \tag{7}
$$
In other words, $\text{span} [\mathbf{a}_1, \dots, \mathbf{a}_n]$ is the set of all possible linear combinations of the vectors $\mathbf{a}$. If the vectors are linearly independent, then the dimension of this set of linear combinations is $n$. If the vectors are linearly dependent, then the dimension is less.

The set of vectors in a span is referred to as a *vector space*. The *dimension* of a vector space is the number of linearly independent vectors in the linear combination which forms the space. Note that the vector space dimension is *not* the dimension (length) of the vectors forming the linear combinations.

**Example 2:** Consider the following 2 vectors in Fig. 1:
The span of these vectors is the (infinite extension of the) plane of the paper.

**Subspaces**
Given a set (space) of vectors $[\mathbf{a}_1, \dots, \mathbf{a}_n] \in \mathbb{R}^m, m \ge n$, a subspace $S$ is a vector subset that satisfies two requirements:
1. If $\mathbf{x}$ and $\mathbf{y}$ are in the subspace, then $\mathbf{x} + \mathbf{y}$ is still in the subspace.
2. If we multiply any vector $\mathbf{x}$ in the subspace by a scalar $c$, then $c\mathbf{x}$ is still in the subspace.

These two requirements imply that for a subspace, any linear combination of vectors which are in the subspace is itself in the subspace. Comparing this idea with that of span, we see a subspace defined by the vectors $[\mathbf{a}_1, \dots, \mathbf{a}_n]$ is identical to $\text{span}[\mathbf{a}_1, \dots, \mathbf{a}_n]$. However, a subspace has the interpretation that the set of vectors comprizing the subspace must be a subset of a larger space. For example, the vectors $[\mathbf{a}_1, \mathbf{a}_2]$ in Fig. 1 define a subspace (the plane of the paper) which is a subset of the three–dimensional universe $\mathbb{R}^3$.

Hence formally, a $k$–dimensional subspace $S$ of $\text{span} [\mathbf{a}_1, \dots, \mathbf{a}_n]$ is determined by $\text{span}[\mathbf{a}_{i_1}, \dots, \mathbf{a}_{i_k}]$, where the distinct indices satisfy $\{i_1, \dots, i_k\} \subset \{1, \dots, n\}$; that is, the vector space $S = \text{span}[\mathbf{a}_{i_1}, \dots, \mathbf{a}_{i_k}]$ is a subset of $\text{span}[\mathbf{a}_1, \dots, \mathbf{a}_n]$.

Note that $[\mathbf{a}_{i_1}, \dots, \mathbf{a}_{i_k}]$ is not necessarily a *basis* for the subspace $S$. This set is a basis only if it is a maximally independent set. This idea is discussed shortly. The set $\{\mathbf{a}_i\}$ need not be linearly independent to define the span or subset.

∗ What is the span of the vectors $[\mathbf{b}_1, \dots, \mathbf{b}_3]$ in example 1?

**Range:**
The *range* of a matrix $\mathbf{A} \in \mathbb{R}^{m \times n}$, denoted $\mathcal{R}(\mathbf{A})$, is a subspace (set of vectors) satisfying
$$
\mathcal{R}(\mathbf{A}) = \{ \mathbf{y} \in \mathbb{R}^m \mid \mathbf{y} = \mathbf{A}\mathbf{x}, \text{ for } \mathbf{x} \in \mathbb{R}^n \}. \tag{8}
$$
We can interpret the matrix–vector multiplication $\mathbf{y} = \mathbf{A}\mathbf{x}$ above according to the column representation for matrix multiplication (2), where the product $\mathbf{C}$ has only one column. Thus, we see that $\mathbf{y}$ is a linear combination of the columns $\mathbf{a}_i$ of $\mathbf{A}$, whose coefficients are the elements $x_i$ of $\mathbf{x}$. Therefore, (8) is equivalent to (7), and $\mathcal{R}(\mathbf{A})$ is thus the span of the columns of $\mathbf{A}$. The distinction between *range* and *span* is that the argument of *range* is a matrix, while for *span* it is a set of vectors. If the columns of $\mathbf{A}$ are (not) linearly independent, then $\mathcal{R}(\mathbf{A})$ will (not) span $n$ dimensions. Thus, the dimension of the vector space $\mathcal{R}(\mathbf{A})$ is less than or equal to $n$. Any vector $\mathbf{y} \in \mathcal{R}(\mathbf{A})$ is of dimension (length) $m$.

**Example 3:**
$$
\mathbf{A} = \begin{bmatrix} 1 & 5 & 3 \\ 2 & 4 & 3 \\ 3 & 3 & 3 \end{bmatrix} \quad (\text{the last column is the average of the first two}) \tag{9}
$$
$\mathcal{R}(\mathbf{A})$ is the set of all linear combinations of any two columns of $\mathbf{A}$.

In the case when $n < m$ (i.e., $\mathbf{A}$ is a *tall* matrix), it is important to note that $\mathcal{R}(\mathbf{A})$ is indeed a subspace of the $m$-dimensional “universe” $\mathbb{R}^m$. In this case, the dimension of $\mathcal{R}(\mathbf{A})$ is less than or equal to $n$. Thus, $\mathcal{R}(\mathbf{A})$ does not span the whole universe, and therefore is a subspace of it.

### 1.3.3 Maximally Independent Set
This is a vector set which cannot be made larger without losing independence, and smaller without remaining maximal; i.e. it is a set containing the maximum number of independent vectors spanning the space.

### 1.3.4 A Basis
A basis for a subspace is any maximally independent set within the subspace. It is not unique.

**Example 4.** A basis for the subspace $S$ spanning the first 2 columns of
$$
\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 3 & -3 & 3 \end{bmatrix}, \quad \text{i.e., } S = \left\{ \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \begin{bmatrix} 2 \\ 3 \\ 0 \end{bmatrix} \right\}
$$
is
$$
\begin{aligned}
\mathbf{e}_1 &= (1, 0, 0)^T \\
\mathbf{e}_2 &= (0, 1, 0)^T.
\end{aligned}
$$
[^chapter1-2]or any other linearly independent set in $\text{span}[\mathbf{e}_1, \mathbf{e}_2]$.

Any vector in $S$ is *uniquely* represented as a linear combination of the basis vectors.

### 1.3.5 Orthogonal Complement Subspace
If we have a subspace $S$ of dimension $n$ consisting of vectors $[\mathbf{a}_1, \dots, \mathbf{a}_n]$, $\mathbf{a}_i \in \mathbb{R}^m, i = 1, \dots, n$, for $n \le m$, the orthogonal complement subspace $S_{\perp}$ of $S$ of dimension $m-n$ is defined as
$$
S_{\perp} = \{ \mathbf{y} \in \mathbb{R}^m \mid \mathbf{y}^T\mathbf{x} = 0 \text{ for all } \mathbf{x} \in S \} \tag{10}
$$
i.e., any vector in $S_{\perp}$ is orthogonal to any vector in $S$. The quantity $S_{\perp}$ is pronounced “S–perp”.

**Example 5:** Take the vector set defining $S$ from Example 4:
$$
S \equiv \begin{bmatrix} 1 & 2 \\ 0 & 3 \\ 0 & 0 \end{bmatrix} \tag{11}
$$
then, a basis for $S_{\perp}$ is
$$
\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \tag{12}
$$

### 1.3.6 Rank
Rank is an important concept which we will use frequently throughout this course. We briefly describe only a few basic features of rank here. The idea is expanded more fully in the following sections.

1. The rank of a matrix is the maximum number of linearly independent rows or columns. Thus, it is the dimension of a basis for the columns (rows) of a matrix.
2. Rank of $\mathbf{A}$ (denoted $\text{rank}(\mathbf{A})$), is the dimension of $\mathcal{R}(\mathbf{A})$.
3. if $\mathbf{A} = \mathbf{B}\mathbf{C}$, and $r_1 = \text{rank}(\mathbf{B})$, $r_2 = \text{rank}(\mathbf{C})$, then $\text{rank}(\mathbf{A}) \le \min(r_1, r_2)$.
4. A matrix $\mathbf{A} \in \mathbb{R}^{m \times n}$ is said to be *rank deficient* if its rank is less than $\min(m, n)$. Otherwise, it is said to be *full rank*.
5. If $\mathbf{A}$ is square and rank deficient, then $\det(\mathbf{A}) = 0$.
6. It can be shown that $\text{rank}(\mathbf{A}) = \text{rank}(\mathbf{A}^T)$. More is said on this point later.

A matrix is said to be *full column (row) rank* if its rank is equal to the number of columns (rows).

**Example:** The rank of $\mathbf{A}$ in Example 4 is 3, whereas the rank of $\mathbf{A}$ in Example 3 is 2.

### 1.3.7 Null Space of A
The null space $\mathcal{N}(\mathbf{A})$ of $\mathbf{A}$ is defined as
$$
\mathcal{N}(\mathbf{A}) = \{ \mathbf{x} \in \mathbb{R}^n \ne \mathbf{0} \mid \mathbf{A}\mathbf{x} = \mathbf{0} \}. \tag{13}
$$
From previous discussions, the product $\mathbf{A}\mathbf{x}$ is a linear combination of the columns $\mathbf{a}_i$ of $\mathbf{A}$, where the elements $x_i$ of $\mathbf{x}$ are the corresponding coefficients. Thus, from (13), $\mathcal{N}(\mathbf{A})$ is the set of non–zero coefficients of all zero linear combinations of the columns of $\mathbf{A}$. If the columns of $\mathbf{A}$ are linearly independent, then $\mathcal{N}(\mathbf{A}) = \emptyset$ by definition, because there can be no coefficients except zero which result in a zero linear combination. In this case, the dimension of the null space is zero, and $\mathbf{A}$ is full column rank. The null space is empty if and only if $\mathbf{A}$ is full column rank, and is non–empty when $\mathbf{A}$ is column rank deficient[^chapter1-3]. Note that any vector in $\mathcal{N}(\mathbf{A})$ is of dimension $n$. Any vector in $\mathcal{N}((\mathbf{A}))$ is orthogonal to the rows of $\mathbf{A}$, and is thus in the orthogonal complement of the span of the rows of $\mathbf{A}$.

**Example 6:** Let $\mathbf{A}$ be as before in Example 3. Then $\mathcal{N}(\mathbf{A}) = c(1, 1, -2)^T$, where $c$ is a real constant.

A further example is as follows. Take 3 vectors $[\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3]$ where $\mathbf{a}_i \in \mathbb{R}^3$, $i=1, \dots, 3$, that are constrained to lie in a 2–dimensional plane. Then there exists a zero linear combination of these vectors. The coefficients of this linear combination define a vector $\mathbf{x}$ which is in the nullspace of $\mathbf{A} = [\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3]$. In this case, we see that $\mathbf{A}$ is rank deficient.

Another important characterization of a matrix is its *nullity*. The nullity of $\mathbf{A}$ is the dimension of the nullspace of $\mathbf{A}$. In Example 6 above, the nullity of $\mathbf{A}$ is one. We then have the following interesting property:
$$
\text{rank}(\mathbf{A}) + \text{nullity}(\mathbf{A}) = n. \tag{14}
$$

## 1.4 Four Fundamental Subspaces of a Matrix
The four matrix subspaces of concern are: the *column space*, the *row space*, and their respective *orthogonal complements*. The development of these four subspaces is closely linked to $\mathcal{N}(\mathbf{A})$ and $\mathcal{R}(\mathbf{A})$. We assume for this section that $\mathbf{A} \in \mathbb{R}^{m \times n}$, $r \le \min(m, n)$, where $r = \text{rank}\mathbf{A}$.

### 1.4.1 The Column Space
This is simply $\mathcal{R}(\mathbf{A})$. Its dimension is $r$. It is the set of all linear combinations of the columns of $\mathbf{A}$.

### 1.4.2 The Orthogonal Complement of the Column Space
This may be expressed as $\mathcal{R}(\mathbf{A})_{\perp}$, with dimension $m-r$. It may be shown to be equivalent to $\mathcal{N}(\mathbf{A}^T)$, as follows: By definition, $\mathcal{N}(\mathbf{A}^T)$ is the set $\mathbf{x}$ satisfying:
$$
\begin{bmatrix} & \\ & \mathbf{A}^T & \\ & \end{bmatrix}
\begin{bmatrix} x_1 \\ \vdots \\ x_m \end{bmatrix} = \mathbf{0}, \tag{15}
$$
where columns of $\mathbf{A}$ are the rows of $\mathbf{A}^T$. From (15), we see that $\mathcal{N}(\mathbf{A}^T)$ is the set of $\mathbf{x} \in \mathbb{R}^m$ which is orthogonal to all columns of $\mathbf{A}$ (rows of $\mathbf{A}^T$). This by definition is the orthogonal complement of $\mathcal{R}(\mathbf{A})$.

### 1.4.3 The Row Space
The row space is defined simply as $\mathcal{R}(\mathbf{A}^T)$, with dimension $r$. The row space is the range of the rows of $\mathbf{A}$, or the subspace spanned by the rows, or the set of all possible linear combinations of the rows of $\mathbf{A}$.

### 1.4.4 The Orthogonal Complement of the Row Space
This may be denoted as $\mathcal{R}(\mathbf{A}^T)_{\perp}$. Its dimension is $n-r$. This set must be that which is orthogonal to all rows of $\mathbf{A}$: i.e., for $\mathbf{x}$ to be in this space, $\mathbf{x}$ must satisfy
$$
\begin{matrix} \text{rows} \\ \text{of} \\ \mathbf{A} \end{matrix} \rightarrow
\begin{bmatrix} \\ \vdots \\ \\ \end{bmatrix}
\begin{bmatrix} x_1 \\ \vdots \\ x_n \end{bmatrix} = \mathbf{0}. \tag{16}
$$
Thus, the set $\mathbf{x}$, which is the orthogonal complement of the row space satisfying (16), is simply $\mathcal{N}(\mathbf{A})$.

We have noted before that $\text{rank}(\mathbf{A}) = \text{rank}(\mathbf{A}^T)$. Thus, the dimension of the row and column subspaces are equal. This is surprising, because it implies the number of linearly independent rows of a matrix is the same as the number of linearly independent columns. This holds regardless of the size or rank of the matrix. It is not an intuitively obvious fact and there is no immediately obvious reason why this should be so. Nevertheless, the rank of a matrix is the number of independent rows *or* columns.

## 1.5 Vector Norms
A *vector norm* is a means of expressing the length or distance associated with a vector. A norm on a vector space $\mathbb{R}^n$ is a function $f$, which maps a point in $\mathbb{R}^n$ into a point in $\mathbb{R}$. Formally, this is stated mathematically as $f: \mathbb{R}^n \rightarrow \mathbb{R}$. The norm has the following properties:
1. $f(\mathbf{x}) \ge 0$ for all $\mathbf{x} \in \mathbb{R}^n$.
2. $f(\mathbf{x}) = 0$ if and only if $\mathbf{x} = \mathbf{0}$.
3. $f(\mathbf{x}+\mathbf{y}) \le f(\mathbf{x}) + f(\mathbf{y})$ for $\mathbf{x}, \mathbf{y} \in \mathbb{R}^n$.
4. $f(a\mathbf{x}) = |a|f(\mathbf{x})$ for $a \in \mathbb{R}, \mathbf{x} \in \mathbb{R}^n$.

We denote the function $f(\mathbf{x})$ as $\|\mathbf{x}\|$.

**The p-norms:** This is a useful class of norms, generalizing on the idea of the Euclidean norm. They are defined by
$$
\|\mathbf{x}\|_p = (|x_1|^p + |x_2|^p + \dots + |x_n|^p)^{1/p}. \tag{17}
$$
If $p=1$:
$$
\|\mathbf{x}\|_1 = \sum_i |x_i|
$$
which is simply the sum of absolute values of the elements.

If $p=2$:
$$
\|\mathbf{x}\|_2 = \left( \sum_i x_i^2 \right)^{\frac{1}{2}} = (\mathbf{x}^T\mathbf{x})^{\frac{1}{2}}
$$
which is the familiar Euclidean norm.

If $p=\infty$:
$$
\|\mathbf{x}\|_\infty = \max_i |x_i|
$$
which is the largest element of $\mathbf{x}$. This may be shown in the following way. As $p \rightarrow \infty$, the largest term within the round brackets in (17) dominates all the others. Therefore (17) may be written as
$$
\|\mathbf{x}\|_\infty = \lim_{p \to \infty} \left[ \sum_{i=1}^n x_i^p \right]^{\frac{1}{p}} = \lim_{p \to \infty} [x_k^p]^{\frac{1}{p}} = x_k \tag{18}
$$
where $k$ is the index corresponding to the largest element $x_i$.

Note that the $p=2$ norm has many useful properties, but is expensive to compute. Obviously, the 1– and $\infty$–norms are easier to compute, but are more difficult to deal with algebraically. All the p–norms obey all the properties of a vector norm.

## 1.6 Determinants
Consider a square matrix $\mathbf{A} \in \mathbb{R}^{m \times m}$. We can define the matrix $\mathbf{A}_{ij}$ as the submatrix obtained from $\mathbf{A}$ by deleting the $i$th row and $j$th column of $\mathbf{A}$. The scalar number $\det(\mathbf{A}_{ij})$ ( where $\det(\cdot)$ denotes determinant) is called the *minor* associated with the element $a_{ij}$ of $\mathbf{A}$. The signed minor $c_{ij} \triangleq (-1)^{j+i} \det(\mathbf{A}_{ij})$ is called the *cofactor* of $a_{ij}$.

The determinant of $\mathbf{A}$ is the m-dimensional volume contained within the columns (rows) of $\mathbf{A}$. This interpretation of determinant is very useful as we see shortly. The determinant of a matrix may be evaluated by the expression
$$
\det(\mathbf{A}) = \sum_{j=1}^m a_{ij}c_{ij}, \quad i \in (1 \dots m). \tag{19}
$$
or
$$
\det(\mathbf{A}) = \sum_{i=1}^m a_{ij}c_{ij}, \quad j \in (1 \dots m). \tag{20}
$$
Both the above are referred to as the *cofactor expansion* of the determinant. Eq. (19) is along the $i$th *row* of $\mathbf{A}$, whereas (20) is along the $j$th *column*. It is indeed interesting to note that both versions above give exactly the same number, regardless of the value of $i$ or $j$.

Eqs. (19) and (20) express the $m \times m$ determinant $\det\mathbf{A}$ in terms of the cofactors $c_{ij}$ of $\mathbf{A}$, which are themselves $(m-1) \times (m-1)$ determinants. Thus, $m-1$ recursions of (19) or (20) will finally yield the determinant of the $m \times m$ matrix $\mathbf{A}$.

From (19) it is evident that if $\mathbf{A}$ is triangular, then $\det(\mathbf{A})$ is the product of the main diagonal elements. Since diagonal matrices are in the upper triangular set, then the determinant of a diagonal matrix is also the product of its diagonal elements.

**Properties of Determinants**
Before we begin this discussion, let us define the volume of a parallelopiped defined by the set of column vectors comprising a matrix as the *principal volume* of that matrix.

We have the following properties of determinants, which are stated without proof:
1. $\det(\mathbf{A}\mathbf{B}) = \det(\mathbf{A})\det(\mathbf{B}) \quad \mathbf{A}, \mathbf{B} \in \mathbb{R}^{m \times m}$.
The principal volume of the product of matrices is the product of principal volumes of each matrix.
2. $\det(\mathbf{A}) = \det(\mathbf{A}^T)$
This property shows that the characteristic polynomials[^chapter1-4] of $\mathbf{A}$ and $\mathbf{A}^T$ are identical. Consequently, as we see later, eigenvalues of $\mathbf{A}^T$ and $\mathbf{A}$ are identical.
3. $\det(c\mathbf{A}) = c^m \det(\mathbf{A}) \quad c \in \mathbb{R}, \mathbf{A} \in \mathbb{R}^{m \times m}$.
This is a reflection of the fact that if each vector defining the principal volume is multiplied by $c$, then the resulting volume is multiplied by $c^m$.
4. $\det(\mathbf{A}) = 0 \iff \mathbf{A}$ is singular.
This implies that at least one dimension of the principal volume of the corresponding matrix has collapsed to zero length.
5. $\det(\mathbf{A}) = \prod_{i=1}^m \lambda_i$, where $\lambda_i$ are the eigen (singular) values of $\mathbf{A}$.
This means the parallelopiped defined by the column or row vectors of a matrix may be transformed into a regular rectangular solid of the same m– dimensional volume whose edges have lengths corresponding to the eigen (singular) values of the matrix.
6. The determinant of an orthonormal[^chapter1-5] matrix is $\pm 1$.
This is easy to see, because the vectors of an orthonormal matrix are all unit length and mutually orthogonal. Therefore the corresponding principal volume is $\pm 1$.
7. If $\mathbf{A}$ is nonsingular, then $\det(\mathbf{A}^{-1}) = [\det(\mathbf{A})]^{-1}$.
8. If $\mathbf{B}$ is nonsingular, then $\det(\mathbf{B}^{-1}\mathbf{A}\mathbf{B}) = \det(\mathbf{A})$.
9. If $\mathbf{B}$ is obtained from $\mathbf{A}$ by interchanging any two rows (or columns), then $\det(\mathbf{B}) = - \det(\mathbf{A})$.
10. If $\mathbf{B}$ is obtained from $\mathbf{A}$ by by adding a scalar multiple of one row to another (or a scalar multiple of one column to another), then $\det(\mathbf{B}) = \det(\mathbf{A})$.

A further property of determinants allows us to compute the *inverse* of $\mathbf{A}$. Define the matrix $\tilde{\mathbf{A}}$ as the *adjoint* of $\mathbf{A}$:
$$
\tilde{\mathbf{A}} = \begin{bmatrix} c_{11} & \dots & c_{1m} \\ \vdots & \ddots & \vdots \\ c_{m1} & \dots & c_{mm} \end{bmatrix}^T \tag{21}
$$
where the $c_{ij}$ are the cofactors of $\mathbf{A}$. According to (19) or (20), the $i$th row $\tilde{\mathbf{a}}_i^T$ of $\tilde{\mathbf{A}}$ times the $i$th column $\mathbf{a}_i$ is $\det(\mathbf{A})$; i.e.,
$$
\tilde{\mathbf{a}}_i^T \mathbf{a}_i = \det(\mathbf{A}), \quad i = 1, \dots, m. \tag{22}
$$
It can also be shown that
$$
\tilde{\mathbf{a}}_i^T \mathbf{a}_j = 0, \quad i \ne j. \tag{23}
$$
Then, combining (22) and (23) for $i, j \in \{1, \dots, m\}$ we have the following interesting property:
$$
\tilde{\mathbf{A}}\mathbf{A} = \det(\mathbf{A})\mathbf{I}, \tag{24}
$$
where $\mathbf{I}$ is the $m \times m$ identity matrix. It then follows from (24) that the inverse $\mathbf{A}^{-1}$ of $\mathbf{A}$ is given as
$$
\mathbf{A}^{-1} = [\det(\mathbf{A})]^{-1} \tilde{\mathbf{A}}. \tag{25}
$$
Neither (19) nor (25) are computationally efficient ways of calculating a determinant or an inverse respectively. Better methods which exploit the properties of various matrix decompositions are made evident later in the course.

[^chapter1-1]: Eq. (4) is called a *linear combination* of the vectors $\mathbf{a}_j$. Each vector is multiplied by a weight (or *coefficient*) $c_j$, and the result summed.
[^chapter1-2]: A vector $\mathbf{e}_i$ is referred to as an *elementary vector*, and has zeros everywhere except for a 1 in the $i$th position.
[^chapter1-3]: *Column rank deficient* is when the rank of the matrix is less than the number of columns.
[^chapter1-4]: The characteristic polynomial of a matrix is defined in Chapter 2.
[^chapter1-5]: An orthonormal matrix is defined in Chapter 2.

# 2 Lecture 2
This lecture discusses eigenvalues and eigenvectors in the context of the Karhunen–Loeve (KL) expansion of a random process. First, we discuss the fundamentals of eigenvalues and eigenvectors, then go on to covariance matrices. These two topics are then combined into the K-L expansion. An example from the field of array signal processing is given as an application of algebraic ideas.

A major aim of this presentation is an attempt to de-mystify the concepts of eigenvalues and eigenvectors by showing a very important application in the field of signal processing.

## 2.1 Eigenvalues and Eigenvectors
Suppose we have a matrix $\mathbf{A}$:
$$
\mathbf{A} = \begin{bmatrix} 4 & 1 \\ 1 & 4 \end{bmatrix} \tag{1}
$$
We investigate its eigenvalues and eigenvectors.

<center>Figure 1: Matrix-vector multiplication for various vectors.</center>

Suppose we take the product $\mathbf{A}\mathbf{x}_1$, where $\mathbf{x}_1 =^T$, as shown in Fig. 1.
Then,
$$
\mathbf{A}\mathbf{x}_1 = \begin{bmatrix} 4 \\ 1 \end{bmatrix}. \tag{2}
$$
By comparing the vectors $\mathbf{x}_1$ and $\mathbf{A}\mathbf{x}_1$ we see that the product vector is scaled and rotated *counter–clockwise* with respect to $\mathbf{x}_1$.

Now consider the case where $\mathbf{x}_2 =^T$. Then $\mathbf{A}\mathbf{x}_2 =^T$. Here, we note a *clockwise* rotation of $\mathbf{A}\mathbf{x}_2$ with respect to $\mathbf{x}_2$.

Now lets consider a more interesting case. Suppose $\mathbf{x}_3 =^T$. Then $\mathbf{A} \mathbf{x}_3 =^T$. Now the product vector points in the *same* direction as $\mathbf{x}_3$. The vector $\mathbf{A}\mathbf{x}_3$ is a scaled version of the vector $\mathbf{x}_3$. Because of this property, $\mathbf{x}_3 =^T$ is an **eigenvector** of $\mathbf{A}$. The scale factor (which in this case is 5) is given the symbol $\lambda$ and is referred to as an **eigenvalue**.

Note that $\mathbf{x} = [1, -1]^T$ is also an eigenvector, because in this case, $\mathbf{A}\mathbf{x} = [3, -3]^T = 3\mathbf{x}$. The corresponding eigenvalue is 3.

Thus we have, if $\mathbf{x}$ is an eigenvector of $\mathbf{A} \in \mathbb{R}^{n \times n}$,
$$
\mathbf{A}\mathbf{x} = \lambda\mathbf{x} \tag{3} \\
\uparrow \text{scalar multiple (eigenvalue)}
$$
i.e., the vector $\mathbf{A}\mathbf{x}$ is in the same direction as $\mathbf{x}$ but scaled by a factor $\lambda$.

Now that we have an understanding of the fundamental idea of an eigenvector, we proceed to develop the idea further. Eq. (3) may be written in the form
$$
(\mathbf{A} - \lambda\mathbf{I})\mathbf{x} = \mathbf{0} \tag{4}
$$
where $\mathbf{I}$ is the $n \times n$ identity matrix. Eq. (4) is a homogeneous system of equations, and from fundamental linear algebra, we know that a nontrivial solution to (4) exists if and only if
$$
\det(\mathbf{A} - \lambda\mathbf{I}) = 0 \tag{5}
$$
where $\det(\cdot)$ denotes determinant. Eq. (5), when evaluated, becomes a polynomial in $\lambda$ of degree $n$. For example, for the matrix $\mathbf{A}$ above we have
$$
\det \left( \begin{bmatrix} 4 & 1 \\ 1 & 4 \end{bmatrix} - \lambda \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \right) = 0
$$
$$
\det \begin{bmatrix} 4 - \lambda & 1 \\ 1 & 4 - \lambda \end{bmatrix} = (4 - \lambda)^2 - 1 = \lambda^2 - 8\lambda + 15 = 0. \tag{6}
$$
It is easily verified that the roots of this polynomial are (5,3), which correspond to the eigenvalues indicated above.

Eq. (5) is referred to as the *characteristic equation* of $\mathbf{A}$, and the corresponding polynomial is the *characteristic polynomial*. The characteristic polynomial is of degree $n$.

More generally, if $\mathbf{A}$ is $n \times n$, then there are $n$ solutions of (5), or $n$ roots of the characteristic polynomial. Thus there are $n$ eigenvalues of $\mathbf{A}$ satisfying (3); i.e.,
$$
\mathbf{A}\mathbf{x}_i = \lambda_i\mathbf{x}_i, \quad i = 1, \dots, n. \tag{7}
$$
If the eigenvalues are all *distinct*, there are $n$ associated linearly–independent eigenvectors, whose directions are *unique*, which span an $n$–dimensional Euclidean space.

**Repeated Eigenvalues:** In the case where there are e.g., $r$ repeated eigenvalues, then a linearly independent set of $n$ eigenvectors exist, provided the rank of the matrix $(\mathbf{A} - \lambda\mathbf{I})$ in (5) is rank $n-r$. Then, the directions of the $r$ eigenvectors associated with the repeated eigenvalues are *not unique*. In fact, consider a set of $r$ linearly independent eigenvectors $\mathbf{v}_1, \dots, \mathbf{v}_r$ associated with the $r$ repeated eigenvalues. Then, it may be shown that any vector in $\text{span}[\mathbf{v}_1, \dots, \mathbf{v}_r]$ is also an eigenvector. This emphasizes the fact the eigenvectors are not unique in this case.

**Example 1:** Consider the matrix given by
$$
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}
$$
It may be easily verified that any vector in $\text{span}[\mathbf{e}_2, \mathbf{e}_3]$ is an eigenvector associated with the zero repeated eigenvalue.

**Example 2:** Consider the $n \times n$ identity matrix. It has $n$ repeated eigenvalues equal to one. In this case, any $n$–dimensional vector is an eigenvector, and the eigenvectors span an $n$–dimensional space.

---
Eq. (5) gives us a clue how to compute eigenvalues. We can formulate the characteristic polynomial and evaluate its roots to give the $\lambda_i$. Once the eigenvalues are available, it is possible to compute the corresponding eigenvectors $\mathbf{v}_i$ by evaluating the nullspace of the quantity $\mathbf{A} - \lambda_i\mathbf{I}$, for $i=1, \dots, n$. This approach is adequate for small systems, but for those of appreciable size, this method is prone to appreciable numerical error. Later, we consider various orthogonal transformations which lead to much more effective techniques for finding the eigenvalues.

We now present some very interesting properties of eigenvalues and eigenvectors, to aid in our understanding.

**Property 1** If the eigenvalues of a (Hermitian)[^chapter2-1] symmetric matrix are distinct, then the eigenvectors are orthogonal.

*Proof.* Let $\{\mathbf{v}_i\}$ and $\{\lambda_i\}, i=1, \dots, n$ be the eigenvectors and corresponding eigenvalues respectively of $\mathbf{A} \in \mathbb{R}^{n \times n}$. Choose any $i, j \in [1, \dots, n], i \ne j$. Then
$$ \mathbf{A}\mathbf{v}_i = \lambda_i\mathbf{v}_i \tag{8} $$
and
$$ \mathbf{A}\mathbf{v}_j = \lambda_j\mathbf{v}_j. \tag{9} $$
Premultiply (8) by $\mathbf{v}_j^T$ and (9) by $\mathbf{v}_i^T$:
$$ \mathbf{v}_j^T \mathbf{A}\mathbf{v}_i = \lambda_i \mathbf{v}_j^T \mathbf{v}_i \tag{10} $$
$$ \mathbf{v}_i^T \mathbf{A}\mathbf{v}_j = \lambda_j \mathbf{v}_i^T \mathbf{v}_j \tag{11} $$
The quantities on the left are equal when $\mathbf{A}$ is symmetric. We show this as follows. Since the left-hand side of (10) is a scalar, its transpose is equal to itself. Therefore, we get $\mathbf{v}_j^T \mathbf{A}\mathbf{v}_i = \mathbf{v}_i^T \mathbf{A}^T \mathbf{v}_j$.[^chapter2-2] But, since $\mathbf{A}$ is symmetric, $\mathbf{A}^T = \mathbf{A}$. Thus, $\mathbf{v}_j^T \mathbf{A}\mathbf{v}_i = \mathbf{v}_i^T \mathbf{A}^T \mathbf{v}_j = \mathbf{v}_i^T \mathbf{A}\mathbf{x}_j$, which was to be shown.
Subtracting (10) from (11), we have
$$ (\lambda_i - \lambda_j)\mathbf{v}_j^T \mathbf{v}_i = 0 \tag{12} $$
where we have used the fact $\mathbf{v}_j^T \mathbf{v}_i = \mathbf{v}_i^T \mathbf{v}_j$. But by hypothesis, $\lambda_i - \lambda_j \ne 0$. Therefore, (12) is satisfied only if $\mathbf{v}_j^T \mathbf{v}_i = 0$, which means the vectors are orthogonal.
$\square$

Here we have considered only the case where the eigenvalues are distinct. If an eigenvalue $\tilde{\lambda}$ is repeated $r$ times, and $\text{rank}(\mathbf{A} - \tilde{\lambda}\mathbf{I}) = n-r$, then a mutually orthogonal set of $n$ eigenvectors can still be found.

Another useful property of eigenvalues of symmetric matrices is as follows:

**Property 2** The eigenvalues of a (Hermitian) symmetric matrix are real.

*Proof:*[^chapter2-3] (By contradiction): First, we consider the case where $\mathbf{A}$ is real. Let $\lambda$ be a non–zero complex eigenvalue of a symmetric matrix $\mathbf{A}$. Then, since the elements of $\mathbf{A}$ are real, $\lambda^*$, the complex–conjugate of $\lambda$, must also be an eigenvalue of $\mathbf{A}$, because the roots of the characteristic polynomial must occur in complex conjugate pairs. Also, if $\mathbf{v}$ is a nonzero eigenvector corresponding to $\lambda$, then an eigenvector corresponding $\lambda^*$ must be $\mathbf{v}^*$, the complex conjugate of $\mathbf{v}$. But **Property 1** requires that the eigenvectors be orthogonal; therefore, $\mathbf{v}^T \mathbf{v}^* = 0$. But $\mathbf{v}^T \mathbf{v}^* = (\mathbf{v}^H\mathbf{v})^*$, which is by definition the complex conjugate of the norm of $\mathbf{v}$. But the norm of a vector is a pure real number; hence, $\mathbf{v}^T \mathbf{v}^*$ must be greater than zero, since $\mathbf{v}$ is by hypothesis nonzero. We therefore have a contradiction. It follows that the eigenvalues of a symmetric matrix cannot be complex; i.e., they are *real*.

While this proof considers only the real symmetric case, it is easily extended to the case where $\mathbf{A}$ is Hermitian symmetric.
$\square$

**Property 3** Let $\mathbf{A}$ be a matrix with eigenvalues $\lambda_i, i=1, \dots, n$ and eigenvectors $\mathbf{v}_i$. Then the eigenvalues of the matrix $\mathbf{A} + s\mathbf{I}$ are $\lambda_i + s$, with corresponding eigenvectors $\mathbf{v}_i$, where $s$ is any real number.

*Proof:* From the definition of an eigenvector, we have $\mathbf{A}\mathbf{v} = \lambda\mathbf{v}$. Further, we have $s\mathbf{I}\mathbf{v} = s\mathbf{v}$. Adding, we have $(\mathbf{A} + s\mathbf{I})\mathbf{v} = (\lambda + s)\mathbf{v}$. This new eigenvector relation on the matrix $(\mathbf{A} + s\mathbf{I})$ shows the eigenvectors are unchanged, while the eigenvalues are displaced by $s$.
$\square$

**Property 4** Let $\mathbf{A}$ be an $n \times n$ matrix with eigenvalues $\lambda_i, i=1, \dots, n$. Then
- The determinant $\det(\mathbf{A}) = \prod_{i=1}^n \lambda_i$.
- The trace[^chapter2-4] $\text{tr}(\mathbf{A}) = \sum_{i=1}^n \lambda_i$.
The proof is straightforward, but because it is easier using concepts presented later in the course, it is not given here.

**Property 5** If $\mathbf{v}$ is an eigenvector of a matrix $\mathbf{A}$, then $c\mathbf{v}$ is also an eigenvector, where $c$ is any real or complex constant.
The proof follows directly by substituting $c\mathbf{v}$ for $\mathbf{v}$ in $\mathbf{A}\mathbf{v} = \lambda\mathbf{v}$. This means that only the direction of an eigenvector can be unique; its norm is not unique.

### 2.1.1 Orthonormal Matrices
Before proceeding with the eigendecomposition of a matrix, we must develop the concept of an *orthonormal matrix*. This form of matrix has mutually orthogonal columns, each of unit norm. This implies that
$$
\mathbf{q}_i^T \mathbf{q}_j = \delta_{ij}, \tag{13}
$$
where $\delta_{ij}$ is the Kronecker delta, and $\mathbf{q}_i$ and $\mathbf{q}_j$ are columns of the orthonormal matrix $\mathbf{Q}$. With (13) in mind, we now consider the product $\mathbf{Q}^T \mathbf{Q}$. The result may be visualized with the aid of the diagram below:
$$
\mathbf{Q}^T\mathbf{Q} = \begin{bmatrix} \leftarrow \mathbf{q}_1^T \rightarrow \\ \leftarrow \mathbf{q}_2^T \rightarrow \\ \vdots \\ \leftarrow \mathbf{q}_N^T \rightarrow \end{bmatrix} \begin{bmatrix} \uparrow & \uparrow & & \uparrow \\ \mathbf{q}_1 & \mathbf{q}_2 & \cdots & \mathbf{q}_N \\ \downarrow & \downarrow & & \downarrow \end{bmatrix} = \mathbf{I}. \tag{14}
$$
(When $i=j$, the quantity $\mathbf{q}_i^T\mathbf{q}_i$ defines the squared 2 norm of $\mathbf{q}_i$, which has been defined as unity. When $i \ne j$, $\mathbf{q}_i^T\mathbf{q}_j = 0$, due to the orthogonality of the $\mathbf{q}_i$). Eq. (14) is a fundamental property of an orthonormal matrix.

Thus, for an orthonormal matrix, (14) implies the inverse may be computed simply by taking the transpose of the matrix, an operation which requires almost no computational effort.

Eq. (14) follows directly from the fact $\mathbf{Q}$ has orthonormal columns. It is not so clear that the quantity $\mathbf{Q}\mathbf{Q}^T$ should also equal the identity. We can resolve this question in the following way. Suppose that $\mathbf{A}$ and $\mathbf{B}$ are any two *square invertible* matrices such that $\mathbf{A}\mathbf{B} = \mathbf{I}$. Then, $\mathbf{B}\mathbf{A}\mathbf{B} = \mathbf{B}$. By parsing this last expression, we have
$$
(\mathbf{B}\mathbf{A}) \cdot \mathbf{B} = \mathbf{B}. \tag{15}
$$
Clearly, if (15) is to hold, then the quantity $\mathbf{B}\mathbf{A}$ must be the identity[^chapter2-5]; hence, if $\mathbf{A}\mathbf{B} = \mathbf{I}$, then $\mathbf{B}\mathbf{A} = \mathbf{I}$. Therefore, if $\mathbf{Q}^T\mathbf{Q} = \mathbf{I}$, then also $\mathbf{Q}\mathbf{Q}^T = \mathbf{I}$. From this fact, it follows that if a matrix has orthonormal columns, then it also must have orthonormal rows. We now develop a further useful property of orthonormal marices:

**Property 6** The vector 2-norm is invariant under an orthonormal transformation.
If $\mathbf{Q}$ is orthonormal, then
$$
\|\mathbf{Q}\mathbf{x}\|_2^2 = \mathbf{x}^T\mathbf{Q}^T\mathbf{Q}\mathbf{x} = \mathbf{x}^T\mathbf{x} = \|\mathbf{x}\|_2^2.
$$
Thus, because the norm does not change, an orthonormal transformation performs a *rotation* operation on a vector. We use this norm–invariance property later in our study of the least–squares problem.

Suppose we have a matrix $\mathbf{U} \in \mathbb{R}^{m \times n}$, where $m > n$, whose columns are orthonormal. We see in this case that $\mathbf{U}$ is a *tall* matrix, which can be formed by extracting only the first $n$ columns of an arbitrary orthonormal matrix. (We reserve the term *orthonormal matrix* to refer to a *complete* $m \times m$ matrix). Because $\mathbf{U}$ has orthonormal columns, it follows that the quantity $\mathbf{U}^T\mathbf{U} = \mathbf{I}_{n \times n}$. However, it is important to realize that the quantity $\mathbf{U}\mathbf{U}^T \ne \mathbf{I}_{m \times m}$ in this case, in contrast to the situation when $m=n$. The latter relation follows from the fact that the $m$ column vectors of $\mathbf{U}^T$ of length $n, n < m$, cannot all be mutually orthogonal. In fact, we see later that $\mathbf{U}\mathbf{U}^T$ is a *projector* onto the subspace $\mathcal{R}(\mathbf{U})$.

Suppose we have a vector $\mathbf{b} \in \mathbb{R}^m$. Because it is easiest, by convention we represent $\mathbf{b}$ using the basis $[\mathbf{e}_1, \dots, \mathbf{e}_m]$, where the $\mathbf{e}_i$ are the *elementary vectors* (all zeros except for a one in the $i$th position). However it is often convenient to represent $\mathbf{b}$ in a basis formed from the columns of an orthonormal matrix $\mathbf{Q}$. In this case, the elements of the vector $\mathbf{c} = \mathbf{Q}^T\mathbf{b}$ are the coefficients of $\mathbf{b}$ in the basis $\mathbf{Q}$. The orthonormal basis is convenient because we can restore $\mathbf{b}$ from $\mathbf{c}$ simply by taking $\mathbf{b} = \mathbf{Q}\mathbf{c}$.

An orthonormal matrix is sometimes referred to as a *unitary* matrix. This follows because the determinant of an orthonormal matrix is $\pm 1$.

### 2.1.2 The Eigendecomposition (ED) of a Square Symmetric Matrix
Almost all matrices on which ED’s are performed (at least in signal processing) are symmetric. A good example are *covariance matrices*, which are discussed in some detail in the next section.

Let $\mathbf{A} \in \mathbb{R}^{n \times n}$ be symmetric. Then, for eigenvalues $\lambda_i$ and eigenvectors $\mathbf{v}_i$, we have
$$
\mathbf{A}\mathbf{v}_i = \lambda_i\mathbf{v}_i, \quad i = 1, \dots, n. \tag{16}
$$
Let the eigenvectors be normalized to unit 2–norm. Then these $n$ equations can be combined, or stacked side–by–side together, and represented in the following compact form:
$$
\mathbf{A}\mathbf{V} = \mathbf{V}\mathbf{\Lambda} \tag{17}
$$
where $\mathbf{V} = [\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_n]$ (i.e., each column of $\mathbf{V}$ is an eigenvector), and
$$
\mathbf{\Lambda} = \begin{bmatrix} \lambda_1 & & & 0 \\ & \lambda_2 & & \\ & & \ddots & \\ 0 & & & \lambda_n \end{bmatrix} = \text{diag}(\lambda_1 \dots \lambda_n). \tag{18}
$$
Corresponding columns from each side of (17) represent one specific value of the index $i$ in (16). Because we have assumed $\mathbf{A}$ is symmetric, from Property 1, the $\mathbf{v}_i$ are orthogonal. Furthermore, since we have assumed $\|\mathbf{v}_i\|_2 = 1$, $\mathbf{V}$ is an orthonormal matrix. Thus, post-multiplying both sides of (17) by $\mathbf{V}^T$, and using $\mathbf{V}\mathbf{V}^T = \mathbf{I}$ we get
$$
\mathbf{A} = \mathbf{V}\mathbf{\Lambda}\mathbf{V}^T. \tag{19}
$$
Eq. (19) is called the **eigendecomposition (ED)** of $\mathbf{A}$. The columns of $\mathbf{V}$ are eigenvectors of $\mathbf{A}$, and the diagonal elements of $\mathbf{\Lambda}$ are the corresponding eigenvalues. Any symmetric matrix may be decomposed in this way. This form of decomposition, with $\mathbf{\Lambda}$ being diagonal, is of extreme interest and has many interesting consequences. It is this decomposition which leads directly to the Karhunen-Loeve expansion which we discuss shortly.

Note that from (19), knowledge of the eigenvalues and eigenvectors of $\mathbf{A}$ is sufficient to completely specify $\mathbf{A}$. Note further that if the eigenvalues are distinct, then the ED is *unique*. There is only one orthonormal $\mathbf{V}$ and one diagonal $\mathbf{\Lambda}$ which satisfies (19).

Eq. (19) can also be written as
$$
\mathbf{V}^T\mathbf{A}\mathbf{V} = \mathbf{\Lambda}. \tag{20}
$$
Since $\mathbf{\Lambda}$ is diagonal, we say that the unitary (orthonormal) matrix $\mathbf{V}$ of eigenvectors **diagonalizes** $\mathbf{A}$. No other orthonormal matrix can diagonalize $\mathbf{A}$. The fact that *only* $\mathbf{V}$ diagonalizes $\mathbf{A}$ is *the* fundamental property of eigenvectors. If you understand that the eigenvectors of a symmetric matrix diagonalize it, then you understand the “mystery” behind eigenvalues and eigenvectors. Thats all there is to it. We look at the K–L expansion later in this lecture in order to solidify this interpretation, and to show some very important signal processing concepts which fall out of the K–L idea. But the K–L analysis is just a direct consequence of that fact that *only* the eigenvectors of a symmetric matrix diagonalize.

### 2.1.3 Conventional Notation on Eigenvalue Indexing
Let $\mathbf{A} \in \mathbb{R}^{n \times n}$ have rank $r \le n$. Also assume $\mathbf{A}$ is positive semi–definite; i.e., all its eigenvalues are $\ge 0$. This is a not too restrictive assumption because most of the matrices on which the eigendecomposition is relevant are positive semi–definite. Then, we see in the next section we have $r$ non-zero eigenvalues and $n-r$ zero eigenvalues. It is common convention to order the eigenvalues so that
$$
\underbrace{\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_r}_{r \text{ nonzero eigenvalues}} > \underbrace{\lambda_{r+1} = \dots, \lambda_n}_{n-r \text{ zero eigenvalues}} = 0 \tag{21}
$$
i.e., we order the columns of eq. (17) so that $\lambda_1$ is the largest, with the remaining nonzero eigenvalues arranged in descending order, followed by $n-r$ zero eigenvalues. Note that if $\mathbf{A}$ is full rank, then $r=n$ and there are no zero eigenvalues. The quantity $\lambda_n$ is the eigenvalue with the lowest value.

The eigenvectors are reordered to correspond with the ordering of the eigenvalues. For notational convenience, we refer to the eigenvector corresponding to the largest eigenvalue as the “largest eigenvector”. The “smallest eigenvector” is then the eigenvector corresponding to the smallest eigenvalue.

## 2.2 The Eigendecomposition in Relation to the Fundamental Matrix Subspaces
In this section, we develop relationships between the eigendecomposition of a matrix and its range, null space and rank.

Here, we consider square symmetric positive semi–definite matrices $\mathbf{A} \in \mathbb{R}^{n \times n}$, whose rank $r \le n$. Let us partition the eigendecomposition of $\mathbf{A}$ in the following form:
$$
\mathbf{A} = \mathbf{V}\mathbf{\Lambda}\mathbf{V}^T = \underset{r \quad n-r}{\begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix}} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{\Lambda}_2 \end{bmatrix} \underset{r \atop n-r}{\begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix}} \tag{22}
$$
where
$$
\begin{aligned}
\mathbf{V}_1 &= [\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_r] \in \mathbb{R}^{n \times r} \\
\mathbf{V}_2 &= [\mathbf{v}_{r+1}, \dots, \mathbf{v}_n] \in \mathbb{R}^{n \times n-r},
\end{aligned} \tag{23}
$$
The columns of $\mathbf{V}_1$ are eigenvectors corresponding to the first $r$ eigenvalues of $\mathbf{A}$, and the columns of $\mathbf{V}_2$ correspond to the $n-r$ smallest eigenvalues. We also have
$$
\mathbf{\Lambda}_1 = \text{diag}[\lambda_1, \dots, \lambda_r] = \begin{bmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_r \end{bmatrix} \in \mathbb{R}^{r \times r}, \tag{24}
$$
and
$$
\mathbf{\Lambda}_2 = \begin{bmatrix} \lambda_{r+1} & & \\ & \ddots & \\ & & \lambda_n \end{bmatrix} \in \mathbb{R}^{(n-r) \times (n-r)}. \tag{25}
$$
In the notation used above, the explicit absence of a matrix element in an off-diagonal position implies that element is zero. We now show that the partition (22) reveals a great deal about the structure of $\mathbf{A}$.

### 2.2.1 Nullspace
In this section, we explore the relationship between the partition of (22) and the nullspace of $\mathbf{A}$. Recall that the nullspace $\mathcal{N}(\mathbf{A})$ of $\mathbf{A}$ is defined as
$$
\mathcal{N}(\mathbf{A}) = \{ \mathbf{x} \ne \mathbf{0} \in \mathbb{R}^n \mid \mathbf{A}\mathbf{x} = \mathbf{0} \}. \tag{26}
$$
From (22), we have
$$
\mathbf{A}\mathbf{x} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{\Lambda}_2 \end{bmatrix} \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}. \tag{27}
$$
We now choose $\mathbf{x}$ so that $\mathbf{x} \in \text{span}(\mathbf{V}_2)$. Then $\mathbf{x} = \mathbf{V}_2\mathbf{c}_2$, where $\mathbf{c}_2$ is any vector in $\mathbb{R}^{n-r}$. Then since $\mathbf{V}_1 \perp \mathbf{V}_2$, we have
$$
\mathbf{A}\mathbf{x} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{\Lambda}_2 \end{bmatrix} \begin{bmatrix} \mathbf{0} \\ \mathbf{c}_2 \end{bmatrix} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{0} \\ \mathbf{\Lambda}_2\mathbf{c}_2 \end{bmatrix}. \tag{28}
$$
From (28), it is clear we can find a non–trivial $\mathbf{x}$ such that $\mathbf{A}\mathbf{x} = \mathbf{0}$ if and only if $\mathbf{\Lambda}_2 = \mathbf{0}$. Thus, a non–empty nullspace can exist if only if $\mathbf{\Lambda}_2 = \mathbf{0}$.

Since $\mathbf{\Lambda}_2 \in \mathbb{R}^{(n-r) \times (n-r)}$, a square symmetric matrix of rank $r \le n$ must have $n-r$ zero eigenvalues.

Moreover from (28) we see that the condition $\mathbf{x} \in \text{span}\mathbf{V}_2$ is also necessary for $\mathbf{A}\mathbf{x} = \mathbf{0}$. This implies that an orthonormal basis for the nullspace of $\mathbf{A}$ is $\mathbf{V}_2$. Since $\mathbf{V}_2 \in \mathbb{R}^{n \times (n-r)}$, the nullity of $\mathbf{A}$ is $n-r$, corresponding to the number of zero eigenvalues.

Thus, we have the important result that if the dimension of $\mathcal{N}(\mathbf{A})$ is $d=n-r$, then $\mathbf{A}$ must have $d$ zero eigenvalues. The matrix $\mathbf{V}_2 \in \mathbb{R}^{n \times (n-r)}$ is an orthonormal basis for $\mathcal{N}(\mathbf{A})$.

### 2.2.2 Range
Let us look at $\mathcal{R}(\mathbf{A})$ in the light of the decomposition of (22), where we have seen that $\mathbf{\Lambda}_2 = \mathbf{0}$ if $\mathbf{A}$ is rank deficient. The definition of $\mathcal{R}(\mathbf{A})$, repeated here for convenience, is
$$
\mathcal{R}(\mathbf{A}) = \{ \mathbf{y} \mid \mathbf{y} = \mathbf{A}\mathbf{x}, \mathbf{x} \in \mathbb{R}^n \}. \tag{29}
$$
The vector quantity $\mathbf{A}\mathbf{x}$ is therefore given as
$$
\mathbf{A}\mathbf{x} = \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}. \tag{30}
$$
In the above, it is understood that if $\mathbf{A}$ is full rank, then the lower right block of zeros in $\mathbf{\Lambda}$ vanishes and $\mathbf{\Lambda}$ becomes equivalent to $\mathbf{\Lambda}_1$.

Let us define $\mathbf{c}$ as
$$
\mathbf{c} = \begin{bmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{bmatrix} = \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}, \tag{31}
$$
where $\mathbf{c}_1 \in \mathbb{R}^r$ and $\mathbf{c}_2 \in \mathbb{R}^{n-r}$. Then,
$$
\begin{aligned}
\mathbf{y} = \mathbf{A}\mathbf{x} &= \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{bmatrix} \\
&= \begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix} \begin{bmatrix} \mathbf{\Lambda}_1\mathbf{c}_1 \\ \mathbf{0} \end{bmatrix} \\
&= \mathbf{V}_1(\mathbf{\Lambda}_1\mathbf{c}_1).
\end{aligned} \tag{32}
$$
From (31), we see that $\text{span}(\mathbf{x}) = \text{span}(\mathbf{c})$, and therefore $\text{span}(\mathbf{\Lambda}_1\mathbf{c}_1) = \mathbb{R}^r$. Thus, the vector $\mathbf{y}$ in (32) consists of all possible linear combinations of the columns of $\mathbf{V}_1$ and $\mathcal{R}(\mathbf{A}) = \mathcal{R}(\mathbf{V}_1)$. Therefore we have the important result that $\mathbf{V}_1$ is an orthonormal basis for $\mathcal{R}(\mathbf{A})$.

## 2.3 Matrix Norms
Now that we have some understanding of eigenvectors and eigenvalues, we can now present the *matrix norm*. The matrix norm is related to the vector norm: it is a function which maps $\mathbb{R}^{m \times n}$ into $\mathbb{R}$. A matrix norm must obey the same properties as a vector norm. Since a norm is only strictly defined for a *vector* quantity, a matrix norm is defined by mapping a matrix into a vector. This is accomplished by post multiplying the matrix by a suitable vector. Some useful matrix norms are now presented:

**Matrix p-Norms:** A matrix p-norm is defined in terms of a vector p-norm. The matrix p-norm of an arbitary matrix $\mathbf{A}$, denoted $\|\mathbf{A}\|_p$, is defined as
$$
\|\mathbf{A}\|_p = \sup_{\mathbf{x} \ne \mathbf{0}} \frac{\|\mathbf{A}\mathbf{x}\|_p}{\|\mathbf{x}\|_p} \tag{33}
$$
where “sup” means *supremum*; i.e., the largest value of the argument over all values of $\mathbf{x} \ne \mathbf{0}$. Since a property of a vector norm is $\|\mathbf{c}\mathbf{x}\|_p = |c| \|\mathbf{x}\|_p$ for any scalar $c$, we can choose $c$ in (33) so that $\|\mathbf{x}\|_p = 1$. Then, an equivalent statement to (33) is
$$
\|\mathbf{A}\|_p = \max_{\|\mathbf{x}\|_p=1} \|\mathbf{A}\mathbf{x}\|_p. \tag{34}
$$
We now provide some interpretation for the above definition for the specific case where $p=2$ and for $\mathbf{A}$ square and symmetric, in terms of the eigendecomposition of $\mathbf{A}$. To find the matrix 2–norm, we differentiate (34) and set the result to zero. Differentiating $\|\mathbf{A}\mathbf{x}\|_2$ directly is difficult. However, we note that finding the $\mathbf{x}$ which maximizes $\|\mathbf{A}\mathbf{x}\|_2$ is equivalent to finding the $\mathbf{x}$ which maximizes $\|\mathbf{A}\mathbf{x}\|_2^2$ and the differentiation of the latter is much easier. In this case, we have $\|\mathbf{A}\mathbf{x}\|_2^2 = \mathbf{x}^T\mathbf{A}^T\mathbf{A}\mathbf{x}$. To find the maximum, we use the method of Lagrange multipliers, since $\mathbf{x}$ is constrained by (34). Therefore we differentiate the quantity
$$
\mathbf{x}^T\mathbf{A}^T\mathbf{A}\mathbf{x} + \gamma(1 - \mathbf{x}^T\mathbf{x}) \tag{35}
$$
and set the result to zero. The quantity $\gamma$ above is the Lagrange multiplier. The details of the differentiation are omitted here, since they will be covered in a later lecture. The interesting result of this process is that $\mathbf{x}$ must satisfy
$$
\mathbf{A}^T\mathbf{A}\mathbf{x} = \gamma\mathbf{x}, \quad \|\mathbf{x}\|_2=1. \tag{36}
$$
Therefore the stationary points of (34) are the eigenvectors of $\mathbf{A}^T\mathbf{A}$. When $\mathbf{A}$ is square and symmetric, the eigenvectors of $\mathbf{A}^T\mathbf{A}$ are equivalent to those of $\mathbf{A}$[^chapter2-6]. Therefore the stationary points of (34) are also the eigenvectors of $\mathbf{A}$. By substituting $\mathbf{x} = \mathbf{v}_1$ into (34) we find that $\|\mathbf{A}\mathbf{x}\|_2 = \lambda_1$.

It then follows that the solution to (34) is given by the eigenvector corresponding to the largest eigenvalue of $\mathbf{A}$, and $\|\mathbf{A}\mathbf{x}\|_2$ is equal to the largest eigenvalue of $\mathbf{A}$.

More generally, it is shown in the next lecture for an *arbitrary* matrix $\mathbf{A}$ that
$$
\|\mathbf{A}\|_2 = \sigma_1 \tag{37}
$$
where $\sigma_1$ is the largest *singular value* of $\mathbf{A}$. This quantity results from the *singular value decomposition*, to be discussed next lecture.

Matrix norms for other values of $p$, for arbitrary $\mathbf{A}$, are given as
$$
\|\mathbf{A}\|_1 = \max_{1 \le j \le n} \sum_{i=1}^m |a_{ij}| \quad (\text{maximum column sum}) \tag{38}
$$
and
$$
\|\mathbf{A}\|_\infty = \max_{1 \le i \le m} \sum_{j=1}^n |a_{ij}| \quad (\text{maximum row sum}). \tag{39}
$$

**Frobenius Norm:** The Frobenius norm is the 2-norm of the vector consisting of the 2- norms of the rows (or columns) of the matrix $\mathbf{A}$:
$$
\|\mathbf{A}\|_F = \left[ \sum_{i=1}^m \sum_{j=1}^n |a_{ij}|^2 \right]^{1/2}
$$

### 2.3.1 Properties of Matrix Norms
1. Consider the matrix $\mathbf{A} \in \mathbb{R}^{m \times n}$ and the vector $\mathbf{x} \in \mathbb{R}^n$. Then,
$$
\|\mathbf{A}\mathbf{x}\|_p \le \|\mathbf{A}\|_p \|\mathbf{x}\|_p \tag{40}
$$
This property follows by dividing both sides of the above by $\|\mathbf{x}\|_p$, and applying (33).

2. If $\mathbf{Q}$ and $\mathbf{Z}$ are orthonormal matrices of appropriate size, then
$$
\|\mathbf{Q}\mathbf{A}\mathbf{Z}\|_2 = \|\mathbf{A}\|_2 \tag{41}
$$
and
$$
\|\mathbf{Q}\mathbf{A}\mathbf{Z}\|_F = \|\mathbf{A}\|_F \tag{42}
$$
Thus, we see that the matrix 2–norm and Frobenius norm are invariant to pre– and post– multiplication by an orthonormal matrix.

3. Further,
$$
\|\mathbf{A}\|_F^2 = \text{tr}(\mathbf{A}^T\mathbf{A}) \tag{43}
$$
where $\text{tr}(\cdot)$ denotes the *trace* of a matrix, which is the sum of its diagonal elements.

[^chapter2-1]: A symmetric matrix is one where $\mathbf{A} = \mathbf{A}^T$, where the superscript $T$ means transpose, i.e, for a symmetric matrix, an element $a_{ij} = a_{ji}$. A Hermitian symmetric (or just Hermitian) matrix is relevant only for the complex case, and is one where $\mathbf{A} = \mathbf{A}^H$, where superscript $H$ denotes the Hermitian transpose. This means the matrix is transposed and complex conjugated. Thus for a Hermitian matrix, an element $a_{ij} = a_{ji}^*$. In this course we will generally consider only real matrices. However, when complex matrices are considered, *Hermitian symmetric* is implied instead of *symmetric*.
[^chapter2-2]: Here, we have used the property that for matrices or vectors $\mathbf{A}$ and $\mathbf{B}$ of conformable size, $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T\mathbf{A}^T$.
[^chapter2-3]: From Lastman and Sinha, *Microcomputer–based Numerical Methods for Science and Engineering*.
[^chapter2-4]: The trace denoted $\text{tr}(\cdot)$ of a square matrix is the sum of its elements on the main diagonal (also called the “diagonal” elements).
[^chapter2-5]: This only holds if $\mathbf{A}$ and $\mathbf{B}$ are square invertible.
[^chapter2-6]: This proof is left as an exercise.

## 2.4 Covariance Matrices
Here, we investigate the concepts and properties of the covariance matrix $\mathbf{R}_{xx}$ corresponding to a stationary, discrete-time random process $x[n]$. We break the infinite sequence $x[n]$ into windows of length $m$, as shown in Fig. 2. The windows generally overlap; in fact, they are typically displaced from one another by only one sample. The samples within the $i$th window become an m-length vector $\mathbf{x}_i, i = 1, 2, 3, \dots$. Hence, the vector corresponding to each window is a *vector sample* from the random process $x[n]$. Processing random signals in this way is the fundamental first step in many forms of electronic system which deal with real signals, such as process identification, control, or any form of communication system including telephones, radio, radar, sonar, etc.

The word *stationary* as used above means the random process is one for which the corresponding joint m–dimensional probability density function describing the distribution of the vector sample $\mathbf{x}$ does not change with time. This means that all moments of the distribution (i.e., quantities such as the mean, the variance, and all cross–correlations, as well as all other higher–order statistical characterizations) are invariant with time. Here however, we deal with a weaker form of stationarity referred to as *wide–sense stationarily* (WSS). With these processes, only the first two moments (mean, variances and covariances) need be invariant with time. Strictly, the idea of a covariance matrix is only relevant for stationary or WSS processes, since expectations only have meaning if the underlying process is stationary.

<center><b>Figure 2:</b> The received signal x[n] is decomposed into windows of length m. The samples in the ith window comprise the vector $\mathbf{x}_i, i = 1, 2, \dots$.</center>

The covariance matrix $\mathbf{R}_{xx} \in \mathbb{R}^{m \times m}$ corresponding to a stationary or WSS process $x[n]$ is defined as
$$
\mathbf{R}_{xx} \triangleq E[(\mathbf{x} - \mathbf{\mu})(\mathbf{x} - \mathbf{\mu})^T] \tag{44}
$$
where $\mathbf{\mu}$ is the vector mean of the process and $E(\cdot)$ denotes the expectation operator over all possible windows of index $i$ of length $m$ in Fig. 2. Often we deal with zero-mean processes, in which case we have
$$
\begin{aligned}\mathbf{R}_{xx}&=E[\mathbf{x}_{i} \mathbf{x}_{i}^{T} ]\\ &=E\left[ \begin{pmatrix}x_{1}\\ x_{2}\\ \vdots\\ x_{m}\end{pmatrix} \begin{pmatrix}x_{1}&x_{2}&\cdots&x_{m}\end{pmatrix} \right]\\ &=E\begin{bmatrix}x_{1}x_{1}&x_{1}x_{2}&\cdots&x_{1}x_{m}\\ x_{2}x_{1}&x_{2}x_{2}&\cdots&x_{2}x_{m}\\ \vdots&\vdots&\ddots&\vdots\\ x_{m}x_{1}&x_{m}x_{2}&\cdots&x_{m}x_{m}\end{bmatrix} ,\end{aligned} \tag{45}
$$
where $(x_1, x_2, \dots, x_m)^T = \mathbf{x}_i$. Taking the expectation over all windows, eq. (45) tells us that the element $r(1,1)$ of $\mathbf{R}_{xx}$ is by definition $E(x_1^2)$, which is the mean-square value (the preferred term is *variance*, whose symbol is $\sigma^2$) of the first element $x_1$ of all possible vector samples $\mathbf{x}_i$ of the process. But because of stationarity, $r(1,1) = r(2,2) = \dots, = r(m,m)$ which are all equal to $\sigma^2$. Thus all main diagonal elements of $\mathbf{R}_{xx}$ are equal to the variance of the process. The element $r(1,2) = E(x_1x_2)$ is the cross–correlation between the first element of $\mathbf{x}_i$ and the second element. Taken over all possible windows, we see this quantity is the cross–correlation of the process and itself delayed by one sample. Because of stationarity, $r(1,2) = r(2,3) = \dots = r(m-1, m)$ and hence all elements on the first upper diagonal are equal to the cross-correlation for a time-lag of one sample. Since multiplication is commutative, $r(2,1) = r(1,2)$, and therefore all elements on the first lower diagonal are also all equal to this same cross-correlation value. Using similar reasoning, all elements on the $j$th upper or lower diagonal are all equal to the cross-correlation value of the process for a time lag of $j$ samples. Thus we see that the matrix $\mathbf{R}_{xx}$ is highly structured.

Let us compare the process shown in Fig. 2 with that shown in Fig. 3. In the former case, we see that the process is relatively slowly varying. Because we have assumed $x[n]$ to be zero mean, adjacent samples of the process in Fig. 2 will have the same sign most of the time, and hence $E(x_i x_{i+1})$ will be a positive number, coming close to the value $E(x_i^2)$. The same can be said for $E(x_i x_{i+2})$, except it is not so close to $E(x_i^2)$. Thus, we see that for the process of Fig. 2, the diagonals decay fairly slowly away from the main diagonal value.

However, for the process shown in Fig. 3, adjacent samples are uncorrelated with each other. This means that adjacent samples are just as likely to have opposite signs as they are to have the same signs. On average, the terms with positive values have the same magnitude as those with negative values. Thus, when the expectations $E(x_i x_{i+1}), E(x_i x_{i+2}), \dots$ are taken, the resulting averages approach zero. In this case then, we see the covariance matrix concentrates around the main diagonal, and becomes equal to $\sigma^2\mathbf{I}$. We note that *all* the eigenvalues of $\mathbf{R}_{xx}$ are equal to the value $\sigma^2$. Because of this property, such processes are referred to as “white”, in analogy to white light, whose spectral components are all of equal magnitude.

The sequence $\{r(1,1), r(1,2), \dots, r(1,m)\}$ is equivalent to the autocorrelation function of the process, for lags 0 to $m-1$. The autocorrelation function of the process characterizes the random process $x[n]$ in terms of its variance, and how quickly the process varies over time. In fact, it may be shown[^chapter2-7] that the Fourier transform of the autocorrelation function is the *power spectral density* of the process. Further discussion on this aspect of random processes is beyond the scope of this treatment; the interested reader is referred to the reference.

<center><b>Figure 3:</b> An uncorrelated discrete–time process.</center>

In practice, it is impossible to evaluate the covariance matrix $\mathbf{R}_{xx}$ using expectations as in (44). Expectations cannot be evaluated in practice– they require an infinite amount of data which is never available, and furthermore, the data must be stationary over the observation interval, which is rarely the case. In practice, we evaluate an *estimate* $\hat{\mathbf{R}}_{xx}$ of $\mathbf{R}_{xx}$, based on an observation of finite length $N$ of the process $x[n]$, by replacing the ensemble average (expectation) with a finite temporal average over the $N$ available data points as follows[^chapter2-8]:
$$
\hat{\mathbf{R}}_{xx} = \frac{1}{N-m+1} \sum_{i=1}^{N-m+1} \mathbf{x}_i \mathbf{x}_i^T. \tag{46}
$$
If (46) is used to evaluate $\hat{\mathbf{R}}$, then the process need only be stationary over the observation length. Thus, by using the covariance estimate given by (46), we can track slow changes in the true covariance matrix of the process with time, provided the change in the process is small over the observation interval $N$. Further properties and discussion covariance matrices are given in Haykin.[^chapter2-9]

It is interesting to note that $\hat{\mathbf{R}}_{xx}$ can be formed in an alternate way from (46). Let $\mathbf{X} \in \mathbb{R}^{m \times (N-m+1)}$ be a matrix whose $i$th column is the vector sample $\mathbf{x}_i, i=1, \dots, N-m+1$ of $x[n]$. Then $\hat{\mathbf{R}}_{xx}$ is also given as
$$
\hat{\mathbf{R}}_{xx} = \frac{1}{N-m+1} \mathbf{X}\mathbf{X}^T. \tag{47}
$$
The proof of this statement is left as an exercise.

**Some Properties of $\mathbf{R}_{xx}$:**
1. $\mathbf{R}_{xx}$ is (Hermitian) symmetric i.e. $r_{ij} = r_{ji}^*$, where $*$ denotes complex conjugation.
2. If the process $x[n]$ is stationary or wide-sense stationary, then $\mathbf{R}_{xx}$ is Toeplitz. This means that all the elements on a given diagonal of the matrix are equal. If you understand this property, then you have a good understanding of the nature of covariance matrices.
3. If $\mathbf{R}_{xx}$ is diagonal, then the elements of $\mathbf{x}$ are uncorrelated. If the magnitudes of the off-diagonal elements of $\mathbf{R}_{xx}$ are significant with respect to those on the main diagonal, the process is said to be *highly correlated*.
4. $\mathbf{R}$ is *positive semi–definite*. This implies that all the eigenvalues are greater than or equal to zero. We will discuss positive definiteness and positive semi–definiteness later.
5. If the stationary or WSS random process $\mathbf{x}$ has a Gaussian probability distribution, then the vector mean and the covariance matrix $\mathbf{R}_{xx}$ are enough to completely specify the statistical characteristics of the process.

## 2.5 The Karhunen-Loeve Expansion of a Random Process
In this section we combine what we have learned about eigenvalues and eigenvectors, and covariance matrices, into the K-L orthonormal expansion of a random process. The KL expansion is extremely useful in compression of images and speech signals.

An orthonormal expansion of a vector $\mathbf{x} \in \mathbb{R}^m$ involves expressing $\mathbf{x}$ as a linear combination of orthonormal basis vectors or functions as follows:
$$
\mathbf{x} = \mathbf{Q}\mathbf{a} \tag{48}
$$
where $\mathbf{a} = [a_1, \dots, a_m]$ contains the coefficients or weights of the expansion, and $\mathbf{Q} = [\mathbf{q}_1, \dots, \mathbf{q}_m]$ is an $m \times m$ orthonormal matrix.[^chapter2-10] Because $\mathbf{Q}$ is orthonormal, we can write
$$
\mathbf{a} = \mathbf{Q}^T\mathbf{x}. \tag{49}
$$
The coefficients $\mathbf{a}$ represent $\mathbf{x}$ in a coordinate system whose axes are the basis $[\mathbf{q}_1, \dots, \mathbf{q}_m]$, instead of the conventional basis $[\mathbf{e}_1, \dots, \mathbf{e}_m]$. By using different basis functions $\mathbf{Q}$, we can generate sets of coefficients with different properties. For example, we can express the discrete Fourier transform (DFT) in the form of (49), where the columns of $\mathbf{Q}$ are harmonically–related rotating exponentials. With this basis, the coefficients $\mathbf{a}$ tell us how much of the frequency corresponding to $\mathbf{q}_i$ is contained in $\mathbf{x}$.

For each vector observation $\mathbf{x}_i$, the matrix $\mathbf{Q}$ remains constant but a new vector $\mathbf{a}_i$ of coefficients is generated. To emphasize this point, we re-write (48) as
$$
\mathbf{x}_i = \mathbf{Q}\mathbf{a}_i, \quad i=1, \dots, N \tag{50}
$$
where $i$ is the vector sample index (corresponding to the window position in Fig. 2) and $N$ is the number of vector observations.

### 2.5.1 Development of the K–L Expansion
<center><b>Figure 4:</b> A scatterplot of vectors $\mathbf{x}_i \in \mathbb{R}^2$, corresponding to a highly correlated (in this case, slowly varying) random process similar to that shown in Figure 2. Each dot represents a separate vector sample, where its first element $x_1$ is plotted against the second element $x_2$.</center>
<center><b>Figure 5:</b> Similar to Figure 4, except the underlying random process is *white*.</center>

Figure 4 shows a scatterplot corresponding to a slowly–varying random process, of the type shown in Figure 2. A scatterplot is a collection of dots, where the $i$th dot is the point on the $m$–dimensional plane corresponding to the vector $\mathbf{x}_i$. Because of obvious restrictions in drawing, we are limited here to the value $m=2$. Because the process we have chosen in this case is slowly varying, the elements of each $\mathbf{x}_i$ are highly correlated; i.e., knowledge of one element implies a great deal about the value of the other. This forces the scatterplot to be elliptical in shape (ellipsoidal in higher dimensions), concentrating along the principal diagonal in the $x_1 – x_2$ plane. Let the quantities $a_1, a_2, \dots, a_m$ be the lengths of the $m$ principal axes of the scatterplot ellipse. With highly correlated processes we find that $a_1 > a_2 > \dots > a_m$. Typically we find that the values $a_i$ diminish quickly with increasing $i$ in larger dimensional systems, when the process is highly correlated.

For the sake of contrast, Figure 5 shows a similar scatterplot, except the underlying random process is white. Here there is no correlation between adjacent samples of the process, so there is no diagonal concentration of the scatterplot in this case. This scatterplot is an $m$–dimensional spheriod.

As we see later in this section, if we wish to store or transmit such a random process, it is wasteful to do so using the conventional coordinate system $[\mathbf{e}_1, \mathbf{e}_2, \dots, \mathbf{e}_m]$ when the process is highly correlated. (Transmission using the conventional coordinate system is equivalent to transmitting the elements $x_1, x_2, \dots, x_m$ of $\mathbf{x}_i$ in sequence.) The inefficiency is a result of the fact that most of the information contained in a given sample $x_j$ of $\mathbf{x}$ must be re–transmitted in adjacent and subsequent samples. In this section, we seek a transformed coordinate system which is more efficient in this respect. The motivation will become clearer towards the end of the section.

The proposed method of finding an optimum coordinate system in which to represent our random process is to find a basis vector $\mathbf{q}_1 \in \mathbb{R}^m$ such that the corresponding coefficient $a_1 = \mathbf{q}_1^T\mathbf{x}$ has the maximum possible mean–squared value (variance). Then, we find a second basis vector $\mathbf{q}_2$ which is constrained to be orthogonal to $\mathbf{q}_1$, such that the variance of the coefficient $a_2 = \mathbf{q}_2^T\mathbf{x}$ is maximum. We continue in this way until we obtain a complete orthonormal basis $\mathbf{Q} = [\mathbf{q}_1, \dots, \mathbf{q}_m]$. Heuristically, we see from Figure 8 that the desired basis is the set of principal axes of the scatterplot ellipse. The benefits of this procedure will become clearer when we apply this technique to the compression of random processes.

The procedure to determine the $\mathbf{q}_i$ is straightforward. The basis vector $\mathbf{q}_1$ is given as the solution to the following problem:
$$
\mathbf{q}_1 = \arg \max_{\|\mathbf{q}\|_2=1} E[|\mathbf{q}^T\mathbf{x}_i|^2] \tag{51}
$$
where the expectation is over all values of $i$. The constraint on the 2–norm of $\mathbf{q}$ is to prevent the solution from going to infinity. Eq. (51) can be written as
$$
\begin{aligned}
\mathbf{q}_1 &= \arg \max_{\|\mathbf{q}\|_2=1} E[\mathbf{q}^T\mathbf{x}\mathbf{x}^T\mathbf{q}] \\
&= \arg \max_{\|\mathbf{q}\|_2=1} \mathbf{q}^T E[\mathbf{x}\mathbf{x}^T] \mathbf{q} \\
&= \arg \max_{\|\mathbf{q}\|_2=1} \mathbf{q}^T\mathbf{R}_{xx}\mathbf{q}.
\end{aligned} \tag{52}
$$
where we have assumed a zero–mean process. The optimization problem above is precisely the same as that for the matrix norm of section 2.3, where it is shown that the stationary points of the argument in (52) are the eigenvectors of $\mathbf{R}_{xx}$. Therefore, the solution to (52) is $\mathbf{q}_1 = \mathbf{v}_1$, the largest eigenvector of $\mathbf{R}_{xx}$. Similarly, $\mathbf{q}_2, \dots, \mathbf{q}_m$ are the remaining successively decreasing eigenvectors of $\mathbf{R}_{xx}$. Thus, the desired orthonormal matrix is the eigenvector matrix $\mathbf{V}$ corresponding to the covariance matrix of the random process. The decomposition of the vector $\mathbf{x}$ in this way is called the **Karhunen Loeve (KL) expansion** of a random process.

In the sequel, the KL expansion is written using the following notation:
$$
\mathbf{x}_i = \mathbf{V}\mathbf{\theta}_i \tag{53}
$$
and
$$
\mathbf{\theta}_i = \mathbf{V}^T\mathbf{x}_i, \tag{54}
$$
where $\mathbf{V} \in \mathbb{R}^{m \times m}$ is the orthonormal matrix of eigenvectors, which is the basis of the KL expansion, and $\mathbf{\theta}_i \in \mathbb{R}^m$ is the vector of KL coefficients.

Thus, the coefficient $\theta_1$ of $\mathbf{\theta}$ on average contains the most energy (variance) of all the coefficients in $\mathbf{\theta}$; $\theta_2$ is the coefficient which contains the next–highest variance, etc. The coefficient $\theta_m$ contains the least variance. This is in contrast to the conventional coordinate system, in which all axes have equal variances.

By lecture 4, we will have sufficient knowledge to prove that the eigenvectors align themselves along the principal axes of the scatterplot ellipsoid of Figure 4. In highly correlated systems, due to the fact that the principal axes of the scatterplot ellipse have decreasing magnitudes (as shown in Figure 4) the variance of the smallest coefficients is typically much smaller than that of the larger coefficients.

**Question:** Suppose the process $\mathbf{x}$ is white, so that $\mathbf{R}_{xx} = E(\mathbf{x}\mathbf{x}^T)$ is already diagonal, with equal diagonal elements; i.e., $\mathbf{R}_{xx} = \sigma^2\mathbf{I}$, as in Figure 5. What is the K-L basis in this case?

To answer this, we see that all the eigenvalues of $\mathbf{R}_{xx}$ are repeated. Therefore, the eigenvector basis is not unique. In fact, in this case, *any* vector in $\mathbb{R}^m$ is an eigenvector of the matrix $\sigma^2\mathbf{I}$ (the eigenvalue is $\sigma^2$). Therefore, *any* orthonormal basis is a K-L basis for a white process. This concept is evident from the circular scatterplot of figure 5.

### 2.5.2 Properties of the KL Expansion
**Property 7** *The coefficients $\mathbf{\theta}$ of the KL expansion are uncorrelated.*

To prove this, we evaluate the covariance matrix $\mathbf{R}_{\theta\theta}$ of $\mathbf{\theta}$, using the definition (54) as follows:
$$
\begin{aligned}
\mathbf{R}_{\theta\theta} &= E[\mathbf{\theta}\mathbf{\theta}^T] \\
&= E[\mathbf{V}^T\mathbf{x}\mathbf{x}^T\mathbf{V}] \\
&= \mathbf{V}^T\mathbf{R}_{xx}\mathbf{V} \\
&= \mathbf{\Lambda}.
\end{aligned} \tag{55}
$$
Since $\mathbf{R}_{\theta\theta}$ is equal to the diagonal eigenvalue matrix $\mathbf{\Lambda}$ of $\mathbf{R}_{xx}$, the KL coefficients are uncorrelated.

**Property 8** *The variance of the $i$th K–L coefficient $\theta_i$ is equal to the $i$th eigenvalue $\lambda_i$ of $\mathbf{R}_{xx}$.*

The proof follows directly from (55); $\mathbf{R}_{\theta\theta} = \mathbf{\Lambda}$.

**Property 9** *The variance of a highly correlated random process $\mathbf{x}$ concentrates in the first few KL coefficients.*

This property may be justified intuitively from the scatterplot of Figure 4, due to the fact that the length of the first principal axis is greater than that of the second. (This effect becomes more pronounced in higher dimensions.) However here we wish to formally prove this property.

Let us denote the covariance matrix of the process shown in Fig. 2 as $\mathbf{R}_2$, and that shown in Fig. 3 as $\mathbf{R}_3$. We assume both processes are stationary with equal powers. Let $\alpha_i$ be the eigenvalues of $\mathbf{R}_2$ and $\beta_i$ be the eigenvalues of $\mathbf{R}_3$. Because $\mathbf{R}_3$ is diagonal with equal diagonal elements, all the $\beta_i$ are equal. Our assumptions imply that the main diagonal elements of $\mathbf{R}_2$ are equal to the main diagonal elements of $\mathbf{R}_3$, and hence from Property 4, the trace and the eigenvalue sum of each covariance matrix are equal.

To obtain further insight into the behavior of the two sets of eigenvalues, we consider Hadamard’s inequality[^chapter2-11] which may be stated as:
> Consider a square matrix $\mathbf{A} \in \mathbb{R}^{m \times m}$. Then, $\det \mathbf{A} \le \prod_{i=1}^m a_{ii}$, with equality if and only if $\mathbf{A}$ is diagonal.

From Hadamard’s inequality, $\det \mathbf{R}_2 < \det \mathbf{R}_3$, and so also from Property 4, $\prod_{i=1}^n \alpha_i < \prod_{i=1}^n \beta_i$. Under the constraint $\sum \alpha_i = \sum \beta_i$, it follows that $\alpha_1 > \alpha_n$; i.e., the eigenvalues of $\mathbf{R}_2$ are not equal. (We say the eigenvalues become *disparate*). Thus, the variance in the first K-L coefficients of a correlated process is larger than that in the later K-L coefficients. Typically in a highly correlated system, only the first few coefficients have significant variance.

To illustrate this phenomenon further, consider the extreme case where the process becomes so correlated that all elements of its covariance matrix approach the same value. (This will happen if the process $x[n]$ does not vary with time). Then, all columns of the covariance matrix are equal, and the rank of $\mathbf{R}_{xx}$ in this case becomes equal to one, and therefore only one eigenvalue is nonzero. Then *all* the energy of the process is concentrated into only the first K-L coefficient. In contrast, when the process is white and stationary, all the eigenvalues are of $\mathbf{R}_{xx}$ are equal, and the variance of the process is equally distributed amongst all the K–L coefficients. The point of this discussion is to indicate a general behavior of random processes, which is that as they become more highly correlated, the variance in the K-L coefficients concentrates in the first few elements. The variance in the remaining coefficients becomes negligible.

### 2.5.3 Applications of the K-L Expansion
Suppose a communications system transmits a stationary, zero–mean highly–correlated sequence $\mathbf{x}$. This means that to transmit the elements of $\mathbf{x}$ directly, one sends a particular element $x_i$ of $\mathbf{x}$ using as many bits as is necessary to convey the information with the required fidelity. However, in sending the next element $x_{i+1}$, almost all of the same information is sent over again, due to the fact that $x_{i+1}$ is highly correlated with $x_i$ and its previous few samples. That is, $x_{i+1}$ contains very little new information relative to $x_i$. It is therefore seen that if $\mathbf{x}$ is highly correlated, transmitting the samples directly (i.e., using the conventional coordinate system) is very wasteful in terms of the number of required bits to transmit.

But if $\mathbf{x}$ is stationary and $\mathbf{R}_{xx}$ is known at the receiver[^chapter2-12], then it is possible for both the transmitter and receiver to “know” the eigenvectors of $\mathbf{R}_{xx}$, the basis set. If the process is sufficiently highly correlated, then, because of the concentration properties of the K–L transform, the variance of the first few coefficients $\mathbf{\theta}$ dominates that of the remaining ones. The later coefficients on average typically have a small variance and are not required to accurately represent the signal.

To implement this form of signal compression, let us say that an acceptable level of distortion is obtained by retaining only the first $j$ significant coefficients. We form a truncated K-L coefficient vector $\hat{\mathbf{\theta}}$ in a similar manner to (54) as
$$
\hat{\mathbf{\theta}} = \begin{bmatrix} \theta_1 \\ \vdots \\ \theta_j \\ 0 \\ \vdots \\ 0 \end{bmatrix} = \begin{bmatrix} \mathbf{v}_1^T \\ \vdots \\ \mathbf{v}_j^T \\ \mathbf{0}^T \\ \vdots \\ \mathbf{0}^T \end{bmatrix} \mathbf{x}. \tag{56}
$$
where coefficients $\theta_{j+1}, \dots, \theta_m$ are set to zero and therefore need not be transmitted. This means we can represent $\mathbf{x}_i$ more compactly without sacrificing significant loss of quality; i.e., we have achieved signal compression.

An approximation $\hat{\mathbf{x}}$ to the original signal can be reconstructed by:
$$
\hat{\mathbf{x}} = \mathbf{V}\hat{\mathbf{\theta}}. \tag{57}
$$
From Property 8, the mean–squared error $\epsilon_j^2$ in the KL reconstruction $\hat{\mathbf{x}}$ is given as
$$
\epsilon_j^2 = \sum_{i=j+1}^m \lambda_i, \tag{58}
$$
which corresponds to the sum of the truncated (smallest) eigenvalues. It is easy to prove that no other basis results in a smaller error. The error $\epsilon_j^2$ in the reconstructed $\hat{\mathbf{x}}$ using any basis $[\mathbf{q}_1, \dots, \mathbf{q}_m]$ is given by
$$
\epsilon_j^2 = \sum_{i=j+1}^m E|\mathbf{q}_i^T\mathbf{x}|_2^2 = \sum_{i=j+1}^m \mathbf{q}_i^T\mathbf{R}_{xx}\mathbf{q}_i. \tag{59}
$$
where the last line uses (51) and (52). We have seen previously that the eigenvectors are the stationary points of each term in the sum above. Since each term in the sum is positive semi–definite definite, $\epsilon_j^2$ is minimized by minimizing each term individually. Therefore, the minimum of (59) is obtained when the $\mathbf{q}_i$ are assigned the $m-j$ smallest eigenvectors. Since $\mathbf{v}_i^T\mathbf{R}_{xx}\mathbf{v}_i = \lambda_i$ when $\|\mathbf{v}\|_2=1$, $\epsilon_j^2 = \epsilon_j^2$ only when $\mathbf{q}_i = \mathbf{v}_i$. This completes the proof.

In speech applications for example, fewer than one tenth of the coefficients are needed for reconstruction with imperceptible degradation. Note that since $\hat{\mathbf{R}}_{xx}$ is positive semi–definite, all eigenvalues are non–negative. Hence, the energy measure (58) is always non–negative for any value of $j$. This type of signal compression is the ultimate form of a type of coding known as *transform coding*.

<center><b>Figure 6:</b> Generation of a highly correlated process $x[n]$</center>

Transform coding is now illustrated by an example. A process $x[n]$ was generated by passing a unit-variance zero–mean white noise sequence $w(n)$ through a 3rd-order lowpass digital lowpass Butterworth filter with a relatively low normalized cutoff frequency (0.1 Hz), as shown in Fig. 6. Vector samples $\mathbf{x}_i$ are extracted from the sequence $x[n]$ as shown in Fig. 2. The filter removes the high-frequency components from the input and so the resulting output process $x[n]$ must therefore vary slowly in time. Thus, the K–L expansion is expected to require only a few principal eigenvector components, and significant compression gains can be achieved.

We show this example for $m=10$. Listed below are the 10 eigenvalues corresponding to $\hat{\mathbf{R}}_{xx}$, the covariance matrix of $\mathbf{x}$, generated from the output of the lowpass filter:

**Eigenvalues:**
0.5468
0.1975
0.1243 $\times 10^{-1}$
0.5112 $\times 10^{-3}$
0.2617 $\times 10^{-4}$
0.1077 $\times 10^{-5}$
0.6437 $\times 10^{-7}$
0.3895 $\times 10^{-8}$
0.2069 $\times 10^{-9}$
0.5761 $\times 10^{-11}$

<center><b>Figure 7:</b> First two eigenvector components as functions of time, for Butterworth lowpass filtered noise example.</center>

The error $\epsilon_j^2$ for $j=2$ is thus evaluated from the above data as 0.0130, which may be compared to the value 0.7573, which is the total eigenvalue sum. The normalized error is $\frac{0.0130}{0.7573} = 0.0171$. Because this error may be considered a low enough value, only the first $j=2$ K-L components may be considered significant. In this case, we have a compression gain of $10/2=5$; i.e., the KL expansion requires only one fifth of the bits relative to representing the signal directly.

The corresponding two principal eigenvectors are plotted in Fig. 7. These plots show the value of the $k$th element $v_k$ of the eigenvector, plotted against its index $k$ for $k=1, \dots, m$. These waveforms may be interpreted as functions of time.

In this case, we would expect that any observation $\mathbf{x}_i$ can be expressed accurately as a linear combination of only the first two eigenvector waveforms shown in Fig. 7, whose coefficients $\hat{\mathbf{\theta}}$ are given by (56). In Fig. 8 we show samples of the true observation $\mathbf{x}$ shown as a waveform in time, compared with the reconstruction $\hat{\mathbf{x}}_i$ formed from (57) using only the first $j=2$ eigenvectors. It is seen that the difference between the true and reconstructed vector samples is small, as expected.

<center><b>Figure 8:</b> Original vector samples of x as functions of time (solid), compared with their reconstruction using only the first two eigenvector components (dotted). Three vector samples are shown.</center>

One of the practical difficulties in using the K–L expansion for coding is that the eigenvector set $\mathbf{V}$ is not usually known at the receiver in practical cases when the observed signal is mildly or severely nonstationary (e.g. speech or video signals). In this case, the covariance matrix estimate $\hat{\mathbf{R}}_{xx}$ is changing with time; hence so are the eigenvectors. Transmission of the eigenvector set to the receiver is expensive in terms of information and so is undesirable. This fact limits the explicit use of the K–L expansion for coding. However, it has been shown[^chapter2-13] that the discrete cosine transform (DCT), which is another form of orthonormal expansion whose basis consists of cosine–related functions, closely approximates the eigenvector basis for a certain wide class of signals. The DCT uses a fixed basis, independent of the signal, and hence is always known at the receiver. Transform coding using the DCT enjoys widespread practical use and is the fundamental idea behind the so–called JEPEG and MPEG international standards for image and video coding. The search for other bases, including particularly wavelet functions, to replace the eigenvector basis is a subject of ongoing research. Thus, even though the K–L expansion by itself is not of much practical value, the theoretical ideas behind it are of significant worth.

## 2.6 Example: Array Processing
Here, we present a further example of the concepts we have developed so far. This example is concerned with *direction of arrival estimation* using arrays of sensors.

<center><b>Figure 9:</b> Physical description of incident signals onto an array of sensors.</center>

Consider an array of $M$ sensors (e.g., antennas) as shown in Fig. 9. Let there be $K < M$ plane waves incident onto the array as shown. Assume the amplitudes of the incident waves do not change during the time taken for the wave to traverse the array. Also assume for the moment that the amplitude of the first incident wave at the first sensor is unity. Then, from the physics shown in Fig. 9, the signal vector $\mathbf{x}$ received by sampling each element of the array simultaneously, from the first incident wave alone, may be described in vector format by $\mathbf{x} = [1, e^{j\phi}, e^{j2\phi}, \dots, e^{j(M-1)\phi}]^T$, where $\phi$ is the electrical phase–shift between adjacent elements of the array, due to the first incident wave.[^chapter2-14] When there are $K$ incident signals, with corresponding amplitudes $a_k, k = 1, \dots, K$, the effects of the $K$ incident signals each add linearly together, each weighted by the corresponding amplitude $a_k$, to form the received signal vector $\mathbf{x}$. The resulting received signal vector, including the noise can then be written in the form
$$
\underset{(M \times 1)}{\mathbf{x}_n} = \underset{(M \times K)}{\mathbf{S}} \underset{(K \times 1)}{\mathbf{a}_n} + \underset{(M \times 1)}{\mathbf{w}_n}, \quad n=1, \dots, N, \tag{60}
$$
where
$\mathbf{w}_n =$ M-length noise vector at time $n$ whose elements are independent random variables with zero mean and variance $\sigma^2$, i.e., $E(w_i^2) = \sigma^2$. The vector $\mathbf{w}$ is assumed uncorrelated with the signal.
$\mathbf{S} = [\mathbf{s}_1, \dots, \mathbf{s}_K]$
$\mathbf{s}_k = [1, e^{j\phi_k}, e^{j2\phi_k}, \dots, e^{j(M-1)\phi_k}]^T$ are referred to as *steering vectors*.
$\phi_k, k=1, \dots, K$ are the electrical phase–shift angles corresponding to the incident signals. The $\phi_k$ are assumed to be distinct.
$\mathbf{a}_n = [a_1, \dots, a_K]_n^T$ is a vector of independent random variables, describing the amplitudes of each of the incident signals at time $n$.

In (60) we obtain $N$ vector samples $\mathbf{x}_n \in \mathbb{C}^{M \times 1}$, $n=1, \dots, N$ by simultaneously sampling all array elements at $N$ distinct points in time. Our objective is to estimate the directions of arrival $\phi_k$ of the plane waves relative to the array, by observing only the received signal.

Note $K < M$. Let us form the covariance matrix $\mathbf{R}$ of the received signal $\mathbf{x}$:
$$
\begin{aligned}
\mathbf{R} = E(\mathbf{x}\mathbf{x}^H) &= E[(\mathbf{S}\mathbf{a} + \mathbf{w})(\mathbf{a}^H\mathbf{S}^H + \mathbf{w}^H)] \\
&= \mathbf{S}E(\mathbf{a}\mathbf{a}^H)\mathbf{S}^H + \sigma^2\mathbf{I}
\end{aligned} \tag{61}
$$
The last line follows because the noise is uncorrelated with the signal, thus forcing the cross–terms to zero. In the last line of (61) we have also used that fact that the covariance matrix of the noise contribution (second term) is $\sigma^2\mathbf{I}$. This follows because the elements of the noise vector $\mathbf{w}$ are independent with equal power. The first term of (61) we call $\mathbf{R}_o$, which is the contribution to the covariance matrix due only to the *signal*.

Lets look at the structure of $\mathbf{R}_o$:
$$
\mathbf{R}_o = \mathbf{S} \underbrace{E(\mathbf{a}\mathbf{a}^H)}_{\text{non-singular}} \mathbf{S}^H
$$
From this structure, we may conclude that $\mathbf{R}_o$ is rank $K$. This may be seen as follows. Let us define $\mathbf{A} \triangleq E(\mathbf{a}\mathbf{a}^H)$ and $\mathbf{B} \triangleq \mathbf{A}\mathbf{S}^H$. Because the $\phi_k$ are distinct, $\mathbf{S}$ is full rank (rank $K$), and because the $a_k$ are independent, $\mathbf{A}$ is full rank ($K$). Therefore the matrix $\mathbf{B} \in \mathbb{C}^{K \times M}$ is of full rank $K$. Then, $\mathbf{R}_o = \mathbf{S}\mathbf{B}$. From this last relation, we can see that the $i$th, $i=1, \dots, M$ column of $\mathbf{R}_o$ is a linear combination of the $K$ columns of $\mathbf{S}$, whose coefficients are the $i$th column of $\mathbf{B}$. Because $\mathbf{B}$ is full rank, $K$ linearly independent linear combinations of the $K$ columns of $\mathbf{S}$ are used to form $\mathbf{R}_o$. Thus $\mathbf{R}_o$ is rank $K$. Because $K < M$, $\mathbf{R}_o$ is rank deficient.

Let us now investigate the eigendecomposition on $\mathbf{R}_o$, where $\lambda_k$ are the eigenvalues of $\mathbf{R}_o$:
$$
\mathbf{R}_o = \mathbf{V}\mathbf{\Lambda}\mathbf{V}^H \tag{62}
$$
or
$$
\mathbf{R}_o = [\dots] \begin{bmatrix} \lambda_1 & & & & \\ & \ddots & & & \\ & & \lambda_K & & \\ & & & 0 & \\ & & & & \ddots \\ & & & & & 0 \end{bmatrix} [\dots]. \tag{63}
$$
Because $\mathbf{R}_o \in \mathbb{C}^{M \times M}$ is rank $K$, it has $K$ non-zero eigenvalues and $M-K$ zero eigenvalues. We enumerate the eigenvectors $\mathbf{v}_1, \dots, \mathbf{v}_K$ as those associated with the largest $K$ eigenvalues, and $\mathbf{v}_{K+1}, \dots, \mathbf{v}_M$ as those associated with the zero eigenvectors.[^chapter2-15] [^chapter2-16]

From the definition of an eigenvector, we have
$$ \mathbf{R}_o\mathbf{v}_i = \mathbf{0} \tag{68} $$
or
$$ \mathbf{S}\mathbf{A}\mathbf{S}^H\mathbf{v}_i = \mathbf{0}, \quad i = K+1, \dots, M. \tag{69} $$
Since $\mathbf{A} = E(\mathbf{a}\mathbf{a}^H)$ and $\mathbf{S}$ are full rank, the only way (69) can be satisfied is if the $\mathbf{v}_i, i = K+1, \dots, M$ are orthogonal to all columns of $\mathbf{S} = [\mathbf{s}(\phi_1), \dots, \mathbf{s}(\phi_K)]$. Therefore we have
$$
\mathbf{s}_k^H \mathbf{v}_i = 0, \quad k=1, \dots, K, \quad i = K+1, \dots, M, \tag{70}
$$
We define the matrix $\mathbf{V}_N \triangleq [\mathbf{v}_{K+1}, \dots, \mathbf{v}_M]$. Therefore (70) may be written as
$$
\mathbf{S}^H\mathbf{V}_N = \mathbf{0}. \tag{71}
$$
We also have
$$
[1, e^{j\phi_k}, e^{j2\phi_k}, \dots, e^{j(M-1)\phi_k}]^H \mathbf{V}_N = \mathbf{0}. \tag{72}
$$
Up to now, we have considered only the noise–free case. What happens when the noise component $\sigma^2\mathbf{I}$ is added to $\mathbf{R}_o$ to give $\mathbf{R}_{xx}$ in (61)? From **Property 3**, Lecture 1, we see that if the eigenvalues of $\mathbf{R}_o$ are $\lambda_i$, then those of $\mathbf{R}_{xx}$ are $\lambda_i + \sigma^2$. The eigenvectors remain unchanged with the noise contribution, and (70) still holds when noise is present. Note these properties only apply to the *true* covariance matrix formed using expectations, rather than the estimated covariance matrix formed using time averages.

With this background in place we can now discuss the MUSIC[^chapter2-17] algorithm for estimating directions of arrival of plane waves incident onto arrays of sensors.

### 2.6.1 The MUSIC Algorithm[^chapter2-18]
We wish to estimate the unknown values $[\phi_1, \dots, \phi_K]$ which comprise $\mathbf{S} = [\mathbf{s}(\phi_1), \dots, \mathbf{s}(\phi_K)]$. The MUSIC algorithm assumes the quantity $K$ is known. In the practical case, where expectations cannot be evaluted because they require infinite data, we form an estimate $\hat{\mathbf{R}}$ of $\mathbf{R}$ based on a finite number $N$ observations as follows:
$$
\hat{\mathbf{R}} = \frac{1}{N} \sum_{n=1}^N \mathbf{x}_n \mathbf{x}_n^H.
$$
Only if $N \to \infty$ does $\hat{\mathbf{R}} \to \mathbf{R}$.

An estimate $\hat{\mathbf{V}}_N$ of $\mathbf{V}_N$ may be formed from the eigenvectors associated with the smallest $M-K$ eigenvalues of $\hat{\mathbf{R}}$. Because of the finite $N$ and the presence of noise, (72) only holds approximately when $\hat{\mathbf{V}}_N$ is used in place of $\mathbf{V}_N$. Thus, a reasonable estimate of the desired directions of arrival may be obtained by finding values of the variable $\phi$ for which the expression on the left of (72) is small instead of exactly zero. Thus, we determine $K$ estimates $\hat{\phi}$ which locally satisy
$$
\hat{\phi} = \arg \min_\phi \|\mathbf{s}^H(\phi)\hat{\mathbf{V}}_N\| \tag{73}
$$
By convention, it is desirable to express (73) as a spectrum–like function, where a peak instead of a null represents a desired signal. It is also convenient to use the squared-norm instead of the norm itself. Thus, the MUSIC “spectrum” $P(\phi)$ is defined as:
$$
P(\phi) = \frac{1}{\mathbf{s}(\phi)^H\hat{\mathbf{V}}_N\hat{\mathbf{V}}_N^H\mathbf{s}(\phi)}
$$
It will look something like what is shown in Fig. 10, when $K=2$ incident signals.

<center><b>Figure 10:</b> MUSIC spectrum $P(\phi)$ for the case $K=2$ signals.</center>

## 2.7 TO SUMMARIZE
- An eigenvector $\mathbf{x}$ of a matrix $\mathbf{A}$ is such that $\mathbf{A}\mathbf{x}$ points in the same direction as $\mathbf{x}$.
- The covariance matrix $\mathbf{R}_{xx}$ of a random process $\mathbf{x}$ is defined as $E(\mathbf{x}\mathbf{x}^H)$. For stationary processes, $\mathbf{R}_{xx}$ completely characterizes the process, and is closely related to its covariance function. In practice, the expectation operation is replaced by a time-average.
- the eigenvectors of $\mathbf{R}_{xx}$ form a natural basis to represent $\mathbf{x}$, since it is only the eigenvectors which diagonalize $\mathbf{R}_{xx}$. This leads to the coefficients $\mathbf{a}$ of the corresponding expansion $\mathbf{x}=\mathbf{V}\mathbf{a}$ being uncorrelated. This has significant application in speech/video encoding.
- The expection of the square of the coefficients above are the eigenvalues of $\mathbf{R}_{xx}$. This gives an idea of the relative power present along each eigenvector.
- If the variables $\mathbf{x}$ are Gaussian, then the K-L coefficients are independent. This greatly simplifies receiver design and analysis.

Many of these points are a direct consequence of the fact that it is only the eigenvectors which can diagonalize a matrix. That is basically the only reason why eigenvalues/eigenvectors are so useful. I hope this serves to demystify this subject. Once you see that it is only the eigenvectors which diagonalize, the property that they are a natural basis for the process $\mathbf{x}$ becomes easy to understand.

An interpretation of an eigenvalue is that it represents the average energy in each coefficient of the K–L expansion.

[^chapter2-7]: A. Papoulis, *Probability, Random Variables, and Stochastic Processes*, McGraw Hill, 3rd Ed.
[^chapter2-8]: Process with this property are referred to as *ergodic processes*.
[^chapter2-9]: Haykin, “Adaptive Filter Theory”, Prentice Hall, 3rd. ed.
[^chapter2-10]: An expansion of $\mathbf{x}$ usually requires the basis vectors to be only linearly independent–not necessarily orthonormal. But orthonormal basis vectors are most commonly used because they can be inverted using the very simple form of (49).
[^chapter2-11]: For a proof, refer to Cover and Thomas, *Elements of Information Theory*
[^chapter2-12]: This is not necessarily a valid assumption. We discuss this point further, later in the section.
[^chapter2-13]: K.R. Rao and P. Yip, “Discrete Cosine Transform– Algorithms, Advantages, Applications”.
[^chapter2-14]: It may be shown that if $d \le \lambda/2$, then there is a one–to–one relationship between the electrical angle $\phi$ and the corresponding physical angle $\theta$. In fact, $\phi = \frac{2\pi d}{\lambda}\sin\theta$. We can only observe the electrical angle $\phi$, not the desired physical angle $\theta$. Thus, we deduce the desired physical angle from the observed electrical angle from this mathematical relationship.
[^chapter2-15]: Note that the eigenvalue zero has multiplicity $M-K$. Therefore, the eigenvectors $\mathbf{v}_{K+1}, \dots, \mathbf{v}_M$ are *not unique*. However, a set of orthonormal eigenvectors which are orthogonal to the remaining eigenvectors exist. Thus we can treat the zero eigenvectors as if they were distinct.
[^chapter2-16]: Let us define the so–called signal subspace $S_S$ as $S_S = \text{span}[\mathbf{v}_1, \dots, \mathbf{v}_K]$ (64) and the noise subspace $S_N$ as $S_N = \text{span}[\mathbf{v}_{K+1}, \dots, \mathbf{v}_M]$. (65) We now digress briefly to discuss these two subspaces further. From our discussion above, all columns of $\mathbf{R}_o$ are linear combinations of the columns of $\mathbf{S}$. Therefore $\text{span}[\mathbf{R}_o] = \text{span}[\mathbf{S}]$. (66) But it is also easy to verify that $\text{span}[\mathbf{R}_o] \in S_S$ (67) Comparing (66) and (67), we see that $\mathbf{S} \in S_S$. From (60) we see that any received signal vector $\mathbf{x}$, in the absence of noise, is a linear combination of the columns of $\mathbf{S}$. Thus, any noise–free signal resides completely in $S_S$. This is the origin of the term “signal subspace”. Further, any component of the received signal residing in $S_N$ must be entirely due to the noise. This is the origin of the term “noise subspace”. We note that the signal and noise subspaces are orthogonal complement subspaces of each other.
[^chapter2-17]: This word is an acronym for **MU**ltiple **SI**gnal **C**lassification.
[^chapter2-18]: R.O. Schmidt, “Multiple emitter location and parameter estimation”, IEEE Trans. Antennas and Propag., vol AP-34, Mar. 1986, pp 276-280.

# 3 The Singular Value Decomposition (SVD)
In this lecture we learn about one of the most fundamental and important matrix decompositions of linear algebra: the SVD. It bears some similarity with the eigendecomposition (ED), but is more general. Usually, the ED is of interest only on symmetric square matrices, but the SVD may be applied to *any* matrix. The SVD gives us important information about the rank, the column and row spaces of the matrix, and leads to very useful solutions and interpretations of least squares problems. We also discuss the concept of *matrix projectors*, and their relationship with the SVD.

## 3.1 The Singular Value Decomposition (SVD)
We have found so far that the eigendecomposition is a useful analytic tool. However, it is only applicable on *square symmetric* matrices. We now consider the SVD, which may be considered a generalization of the ED to arbitrary matrices. Thus, with the SVD, all the analytical uses of the ED which before were restricted to symmetric matrices may now be applied to any form of matrix, regardless of size, whether it is symmetric or nonsymmetric, rank deficient, etc.

**Theorem 1** Let $\mathbf{A} \in \mathbb{R}^{m \times n}$. Then $\mathbf{A}$ can be decomposed according to the *singular value decomposition* as
$$
\mathbf{A} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^T \tag{1}
$$
where $\mathbf{U}$ and $\mathbf{V}$ are orthonormal and
$$
\mathbf{U} \in \mathbb{R}^{m \times m}, \quad \mathbf{V} \in \mathbb{R}^{n \times n}
$$
and
$$
\mathbf{\Sigma} = \text{diag}(\sigma_1, \sigma_2, \dots, \sigma_p) \in \mathbb{R}^{m \times n} \quad p = \min(m,n)
$$
where
$$
\sigma_1 \ge \sigma_2 \ge \sigma_3 \dots \ge \sigma_p \ge 0.
$$
The matrix $\mathbf{\Sigma}$ must be of dimension $\mathbb{R}^{m \times n}$ (i.e., the same size as $\mathbf{A}$), to maintain dimensional consistency of the product in (1). It is therefore padded with zeros either on the bottom or to the right of the diagonal block, depending on whether $m > n$ or $m < n$, respectively. We denote the square $p \times p$ diagonal matrix as $\tilde{\mathbf{\Sigma}}$; the $m \times n$ diagonal matrix containing the zero blocks is denoted as $\mathbf{\Sigma}$.

Since $\mathbf{U}$ and $\mathbf{V}$ are orthonormal, we may also write (1) in the form:
$$
\underset{m \times m}{\mathbf{U}^T} \underset{m \times n}{\mathbf{A}} \underset{n \times n}{\mathbf{V}} = \underset{m \times n}{\mathbf{\Sigma}} \tag{2}
$$
where $\mathbf{\Sigma}$ is a diagonal matrix. The values $\sigma_i$ which are defined to be positive, are referred to as the **singular values** of $\mathbf{A}$. The columns $\mathbf{u}_i$ and $\mathbf{v}_i$ of $\mathbf{U}$ and $\mathbf{V}$ are respectively called the **left** and **right singular vectors** of $\mathbf{A}$.

The SVD corresponding to (1) may be shown diagramatically in the following way:
$$
\mathbf{A} = \underset{m \times m}{\begin{bmatrix} & & \\ & \mathbf{U} & \\ & & \end{bmatrix}} \underset{m \times n}{\begin{bmatrix} \sigma_1 & & & 0 \\ & \ddots & & \\ & & \sigma_p & \\ 0 & & & \ddots \\ & & & & 0 \end{bmatrix}} \underset{n \times n}{\begin{bmatrix} & \\ \mathbf{V}^T \\ & \end{bmatrix}} \tag{3}
$$
Each line above represents a column of either $\mathbf{U}$ or $\mathbf{V}$.

## 3.2 Existence Proof of the SVD
Consider two vectors $\mathbf{x}$ and $\mathbf{y}$ where $\|\mathbf{x}\|_2 = \|\mathbf{y}\|_2 = 1$, s.t. $\mathbf{A}\mathbf{x} = \sigma\mathbf{y}$, where $\sigma = \|\mathbf{A}\|_2$. The fact that such vectors $\mathbf{x}$ and $\mathbf{y}$ can exist follows from the definition of the matrix 2-norm. We define orthonormal matrices $\mathbf{U}$ and $\mathbf{V}$ so that $\mathbf{x}$ and $\mathbf{y}$ form their first columns, as follows:
$$
\begin{aligned}
\mathbf{U} &= [\mathbf{y}, \mathbf{U}_1] \\
\mathbf{V} &= [\mathbf{x}, \mathbf{V}_1]
\end{aligned}
$$
That is, $\mathbf{U}_1$ consists of a set of non–unique orthonormal columns which are mutually orthogonal to themselves and to $\mathbf{y}$; similarly for $\mathbf{V}_1$.

We then define a matrix $\mathbf{A}_1$ as
$$
\mathbf{U}^T\mathbf{A}\mathbf{V} = \mathbf{A}_1 = \begin{bmatrix} \mathbf{y}^T \\ \mathbf{U}_1^T \end{bmatrix} \mathbf{A} [\mathbf{x}, \mathbf{V}_1] \tag{4}
$$
The matrix $\mathbf{A}_1$ has the following structure:
$$
\underbrace{\begin{bmatrix} \mathbf{y}^T \\ \mathbf{U}_1^T \end{bmatrix}}_{\text{orthonormal}} \mathbf{A} \underbrace{\begin{bmatrix} \mathbf{x} & \mathbf{V}_1 \end{bmatrix}}_{\text{orthonormal}} = \begin{bmatrix} \mathbf{y}^T \\ \mathbf{U}_1^T \end{bmatrix} \begin{bmatrix} \sigma\mathbf{y} & \mathbf{A}\mathbf{V}_1 \end{bmatrix} = \underset{1 \quad n-1}{\overset{1 \atop m-1}{\begin{bmatrix} \sigma & \mathbf{w}^T \\ \mathbf{0} & \mathbf{B} \end{bmatrix}}} \triangleq \mathbf{A}_1. \tag{5}
$$
where $\mathbf{B} \triangleq \mathbf{U}_1^T\mathbf{A}\mathbf{V}_1$. The $\mathbf{0}$ in the (2,1) block above follows from the fact that $\mathbf{U}_1 \perp \mathbf{y}$, because $\mathbf{U}$ is orthonormal.

Now, we post-multiply both sides of (5) by the vector $\begin{bmatrix} \sigma \\ \mathbf{w} \end{bmatrix}$ and take 2-norms:
$$
\left\| \mathbf{A}_1 \begin{bmatrix} \sigma \\ \mathbf{w} \end{bmatrix} \right\|_2^2 = \left\| \begin{bmatrix} \sigma & \mathbf{w}^T \\ \mathbf{0} & \mathbf{B} \end{bmatrix} \begin{bmatrix} \sigma \\ \mathbf{w} \end{bmatrix} \right\|_2^2 \ge (\sigma^2 + \mathbf{w}^T\mathbf{w})^2. \tag{6}
$$
This follows because the term on the extreme right is only the first element of the vector product of the middle term. But, as we have seen, matrix p-norms obey the following property:
$$
\|\mathbf{A}\mathbf{x}\|_2 \le \|\mathbf{A}\|_2 \|\mathbf{x}\|_2. \tag{7}
$$
Therefore using (6) and (7), we have
$$
\|\mathbf{A}_1\|_2^2 \left\| \begin{bmatrix} \sigma \\ \mathbf{w} \end{bmatrix} \right\|_2^2 \ge \left\| \mathbf{A}_1 \begin{bmatrix} \sigma \\ \mathbf{w} \end{bmatrix} \right\|_2^2 \ge (\sigma^2 + \mathbf{w}^T\mathbf{w})^2. \tag{8}
$$
Note that $\left\| \begin{bmatrix} \sigma \\ \mathbf{w} \end{bmatrix} \right\|_2^2 = \sigma^2 + \mathbf{w}^T\mathbf{w}$. Dividing (8) by this quantity, we obtain
$$
\|\mathbf{A}_1\|_2^2 \ge \sigma^2 + \mathbf{w}^T\mathbf{w}. \tag{9}
$$
But, we defined $\sigma = \|\mathbf{A}\|_2$. Therefore, the following must hold:
$$
\sigma = \|\mathbf{A}\|_2 = \|\mathbf{U}^T\mathbf{A}\mathbf{V}\|_2 = \|\mathbf{A}_1\|_2 \tag{10}
$$
where the equality on the right follows because the matrix 2-norm is invariant to matrix pre- and post-multiplication by an orthonormal matrix. By comparing (9) and (10), we have the result $\mathbf{w} = \mathbf{0}$.

Substituting this result back into (5), we now have
$$
\mathbf{A}_1 = \begin{bmatrix} \sigma & \mathbf{0} \\ \mathbf{0} & \mathbf{B} \end{bmatrix}. \tag{11}
$$
The whole process repeats using only the component $\mathbf{B}$, until $\mathbf{A}_n$ becomes diagonal. $\square$

It is instructive to consider an alternative proof for the SVD. The following is useful because it is a *constructive proof*, which shows us how to form the components of the SVD.

**Theorem 2** Let $\mathbf{A} \in \mathbb{R}^{m \times n}$ be a rank $r$ matrix ($r \le p = \min(m, n)$). Then there exist orthonormal matrices $\mathbf{U}$ and $\mathbf{V}$ such that
$$
\mathbf{U}^T\mathbf{A}\mathbf{V} = \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \tag{12}
$$
where
$$
\tilde{\mathbf{\Sigma}} = \text{diag}(\sigma_1, \dots, \sigma_r), \quad \sigma_i > 0. \tag{13}
$$
*Proof:*
Consider the square symmetric positive semi–definite matrix $\mathbf{A}^T\mathbf{A}$[^chapter3-1]. Let the eigenvalues greater than zero be $\sigma_1^2, \sigma_2^2, \dots, \sigma_r^2$. Then, from our knowledge of the eigendecomposition, there exists an orthonormal matrix $\mathbf{V} \in \mathbb{R}^{n \times n}$ such that
$$
\mathbf{V}^T\mathbf{A}^T\mathbf{A}\mathbf{V} = \begin{bmatrix} \tilde{\mathbf{\Sigma}}^2 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix}. \tag{14}
$$
where $\tilde{\mathbf{\Sigma}}^2 = \text{diag}[\sigma_1^2, \dots, \sigma_r^2]$. We now partition $\mathbf{V}$ as $[\mathbf{V}_1 \ \mathbf{V}_2]$, where $\mathbf{V}_1 \in \mathbb{R}^{n \times r}$. Then (14) has the form
$$
\underset{n}{\begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix}} \mathbf{A}^T\mathbf{A} \underset{r \quad n-r}{\begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix}} = \begin{bmatrix} \tilde{\mathbf{\Sigma}}^2 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix}. \tag{15}
$$
Then by equating corresponding blocks in (15) we have
$$
\mathbf{V}_1^T\mathbf{A}^T\mathbf{A}\mathbf{V}_1 = \tilde{\mathbf{\Sigma}}^2 \quad (r \times r) \tag{16}
$$
$$
\mathbf{V}_2^T\mathbf{A}^T\mathbf{A}\mathbf{V}_2 = \mathbf{0}. \quad (n-r) \times (n-r) \tag{17}
$$
From (16), we can write
$$
\tilde{\mathbf{\Sigma}}^{-1}\mathbf{V}_1^T\mathbf{A}^T\mathbf{A}\mathbf{V}_1\tilde{\mathbf{\Sigma}}^{-1} = \mathbf{I}. \tag{18}
$$
Then, we define the matrix $\mathbf{U}_1 \in \mathbb{R}^{m \times r}$ from (18) as
$$
\mathbf{U}_1 = \mathbf{A}\mathbf{V}_1\tilde{\mathbf{\Sigma}}^{-1}. \tag{19}
$$
Then from (18) we have $\mathbf{U}_1^T\mathbf{U}_1 = \mathbf{I}$ and it follows that
$$
\mathbf{U}_1^T\mathbf{A}\mathbf{V}_1 = \tilde{\mathbf{\Sigma}}. \tag{20}
$$
From (17) we also have
$$
\mathbf{A}\mathbf{V}_2 = \mathbf{0}. \tag{21}
$$
We now choose a matrix $\mathbf{U}_2$ so that $\mathbf{U} = [\mathbf{U}_1 \ \mathbf{U}_2]$, where $\mathbf{U}_2 \in \mathbb{R}^{m \times (m-r)}$, is orthonormal. Then from (19) and because $\mathbf{U}_1 \perp \mathbf{U}_2$, we have
$$
\mathbf{U}_2^T\mathbf{U}_1 = \mathbf{U}_2^T\mathbf{A}\mathbf{V}_1\tilde{\mathbf{\Sigma}}^{-1} = \mathbf{0}. \tag{22}
$$
Therefore
$$
\mathbf{U}_2^T\mathbf{A}\mathbf{V}_1 = \mathbf{0}. \tag{23}
$$
Combining (20), (21) and (23), we have
$$
\mathbf{U}^T\mathbf{A}\mathbf{V} = \begin{bmatrix} \mathbf{U}_1^T\mathbf{A}\mathbf{V}_1 & \mathbf{U}_1^T\mathbf{A}\mathbf{V}_2 \\ \mathbf{U}_2^T\mathbf{A}\mathbf{V}_1 & \mathbf{U}_2^T\mathbf{A}\mathbf{V}_2 \end{bmatrix} = \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \tag{24}
$$
$\square$
The proof can be repeated using an eigendecomposition on the matrix $\mathbf{A}\mathbf{A}^T \in \mathbb{R}^{m \times m}$ instead of on $\mathbf{A}^T\mathbf{A}$. In this case, the roles of the orthonormal matrices $\mathbf{V}$ and $\mathbf{U}$ are interchanged.

The above proof is useful for several reasons:
- It is short and elegant.
- We can also identify which part of the SVD is not unique. Here, we assume that $\mathbf{A}^T\mathbf{A}$ has no repeated non–zero eigenvalues. Because $\mathbf{V}_2$ are the eigenvectors corresponding to the zero eigenvalues of $\mathbf{A}^T\mathbf{A}$, $\mathbf{V}_2$ is not unique when there are repeated zero eigenvalues. This happens when $m < n+1$, (i.e., $\mathbf{A}$ is sufficiently short) or when the nullity of $\mathbf{A} \ge 2$, or a combination of these conditions.
- By its construction, the matrix $\mathbf{U}_2 \in \mathbb{R}^{m \times m-r}$ is not unique whenever it consists of two or more columns. This happens when $m-2 \ge r$.
It is left as an exercise to show that similar conclusions on the uniqueness of $\mathbf{U}$ and $\mathbf{V}$ can be made when the proof is developed using the matrix $\mathbf{A}\mathbf{A}^T$.

## 3.3 Partitioning the SVD
Here we assume that $\mathbf{A}$ has $r \le p$ non-zero singular values (and $p-r$ zero singular values). Later, we see that $r = \text{rank}(\mathbf{A})$. For convenience of notation, we arrange the singular values as:
$$
\underbrace{\sigma_1 \ge \dots \ge \sigma_r}_{\substack{\text{max} \qquad \text{min} \\ \text{non-zero} \\ \text{s.v.} \\ r \text{ non-zero s.v's}}} > \underbrace{\sigma_{r+1} = \dots = \sigma_p = 0}_{p-r \text{ zero s.v.'s}}
$$
In the remainder of this lecture, we use the SVD partitioned in both $\mathbf{U}$ and $\mathbf{V}$. We can write the SVD of $\mathbf{A}$ in the form
$$
\mathbf{A} = \begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix} \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \tag{25}
$$
where where $\tilde{\mathbf{\Sigma}} \in \mathbb{R}^{r \times r} = \text{diag}(\sigma_1, \dots, \sigma_r)$, and $\mathbf{U}$ is partitioned as
$$
\mathbf{U} = \underset{r \quad m-r}{\begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix}} \quad m \tag{26}
$$
The columns of $\mathbf{U}_1$ are the left singular vectors associated with the $r$ nonzero singular values, and the columns of $\mathbf{U}_2$ are the left singular vectors associated with the zero singular values. $\mathbf{V}$ is partitioned in an analogous manner:
$$
\mathbf{V} = \underset{r \quad n-r}{\begin{bmatrix} \mathbf{V}_1 & \mathbf{V}_2 \end{bmatrix}} \quad n \tag{27}
$$

## 3.4 Interesting Properties and Interpretations of the SVD
The above partition reveals many interesting properties of the SVD:

### 3.4.1 rank(A) = r
Using (25), we can write $\mathbf{A}$ as
$$
\mathbf{A} = \begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix} \begin{bmatrix} \tilde{\mathbf{\Sigma}}\mathbf{V}_1^T \\ \mathbf{0} \end{bmatrix} = \mathbf{U}_1\tilde{\mathbf{\Sigma}}\mathbf{V}_1^T = \mathbf{U}_1\mathbf{B} \tag{28}
$$
where $\mathbf{B} \in \mathbb{R}^{r \times n} \triangleq \tilde{\mathbf{\Sigma}}\mathbf{V}_1^T$. From (28) it is clear that the $i$th, $i=1, \dots, r$ column of $\mathbf{A}$ is a linear combination of the columns of $\mathbf{U}_1$, whose coefficients are given by the $i$th column of $\mathbf{B}$. But since there are $r \le n$ columns in $\mathbf{U}_1$, there can only be $r$ linearly independent columns in $\mathbf{A}$. It follows from the definition of rank that $\text{rank}(\mathbf{A}) = r$.

This point is analogous to the case previously considered in Lecture 2, where we saw rank is equal to the number of non-zero eigenvalues, when $\mathbf{A}$ is a square symmetric matrix. In this case however, the result applies to *any* matrix. This is another example of how the SVD is a generalization of the eigendecomposition.

Determination of rank when $\sigma_1, \dots, \sigma_r$ are distinctly greater than zero, and when $\sigma_{r+1}, \dots, \sigma_p$ are exactly zero is easy. But often in practice, due to finite precision arithmetic and fuzzy data, $\sigma_r$ may be very small, and $\sigma_{r+1}$ may be not quite zero. Hence, in practice, determination of rank is not so easy. A common method is to declare $\text{rank} \mathbf{A} = r$ if $\sigma_{r+1} \le \epsilon$, where $\epsilon$ is a small number specific to the problem considered.

### 3.4.2 $\mathcal{N}(\mathbf{A}) = \mathcal{R}(\mathbf{V}_2)$
Recall the nullspace $\mathcal{N}(\mathbf{A}) = \{\mathbf{x} \ne \mathbf{0} \mid \mathbf{A}\mathbf{x} = \mathbf{0}\}$. So, we investigate the set $\{\mathbf{x}\}$ such that $\mathbf{A}\mathbf{x} = \mathbf{0}$. Let $\mathbf{x} \in \text{span}(\mathbf{V}_2)$; i.e., $\mathbf{x} = \mathbf{V}_2\mathbf{c}$, where $\mathbf{c} \in \mathbb{R}^{n-r}$. By substituting (25) for $\mathbf{A}$, by noting that $\mathbf{V}_1 \perp \mathbf{V}_2$ and that $\mathbf{V}_1^T\mathbf{V}_1 = \mathbf{I}$, we have
$$
\mathbf{A}\mathbf{x} = \begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix} \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{0} \\ \mathbf{c} \end{bmatrix} = \mathbf{0}. \tag{29}
$$
Thus, $\text{span}(\mathbf{V}_2)$ is at least a subspace of $\mathcal{N}(\mathbf{A})$. However, if $\mathbf{x}$ contains any components of $\mathbf{V}_1$, then (29) will not be zero. But since $\mathbf{V} = [\mathbf{V}_1 \mathbf{V}_2]$ is a complete basis in $\mathbb{R}^n$, we see that $\mathbf{V}_2$ alone is a basis for the nullspace of $\mathbf{A}$.

### 3.4.3 $\mathcal{R}(\mathbf{A}) = \mathcal{R}(\mathbf{U}_1)$
Recall that the definition of range $\mathcal{R}(\mathbf{A})$ is $\{\mathbf{y} \mid \mathbf{y} = \mathbf{A}\mathbf{x}, \mathbf{x} \in \mathbb{R}^n\}$. From (25),
$$
\mathbf{A}\mathbf{x} = \begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix} \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x} = \begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix} \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{d}_1 \\ \mathbf{d}_2 \end{bmatrix} \tag{30}
$$
where
$$
\underset{r \atop n-r}{\begin{bmatrix} \mathbf{d}_1 \\ \mathbf{d}_2 \end{bmatrix}} = \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x}. \tag{31}
$$
From the above we have
$$
\mathbf{A}\mathbf{x} = \begin{bmatrix} \mathbf{U}_1 & \mathbf{U}_2 \end{bmatrix} \begin{bmatrix} \tilde{\mathbf{\Sigma}}\mathbf{d}_1 \\ \mathbf{0} \end{bmatrix} = \mathbf{U}_1(\tilde{\mathbf{\Sigma}}\mathbf{d}_1) \tag{32}
$$
We see that as $\mathbf{x}$ moves throughout $\mathbb{R}^n$, the quantity $\tilde{\mathbf{\Sigma}}\mathbf{d}_1$ moves throughout $\mathbb{R}^r$. Thus, the quantity $\mathbf{y} = \mathbf{A}\mathbf{x}$ in this context consists of all linear combinations of the columns of $\mathbf{U}_1$. Thus, an orthonormal basis for $\mathcal{R}(\mathbf{A})$ is $\mathbf{U}_1$.

### 3.4.4 $\mathcal{R}(\mathbf{A}^T) = \mathcal{R}(\mathbf{V}_1)$
Recall that $\mathcal{R}(\mathbf{A}^T)$ is the set of all linear combinations of rows of $\mathbf{A}$. Our property can be seen using a transposed version of the argument in Section 3.4.3 above. Thus, $\mathbf{V}_1$ is an orthonormal basis for the rows of $\mathbf{A}$.

### 3.4.5 $\mathcal{R}(\mathbf{A})_{\perp} = \mathcal{R}(\mathbf{U}_2)$
From Sect. 3.4.3, we see that $\mathcal{R}(\mathbf{A}) = \mathcal{R}(\mathbf{U}_1)$. Since from (25), $\mathbf{U}_1 \perp \mathbf{U}_2$, then $\mathbf{U}_2$ is a basis for the orthogonal complement of $\mathcal{R}(\mathbf{A})$. Hence the result.

### 3.4.6 $\|\mathbf{A}\|_2 = \sigma_1 = \sigma_{\max}$
This is easy to see from the definition of the 2-norm and the ellipsoid example of section 3.6.

### 3.4.7 Inverse of A
If the svd of a square matrix $\mathbf{A}$ is given, it is easy to find the inverse. Of course, we must assume $\mathbf{A}$ is full rank, (which means $\sigma_i > 0$) for the inverse to exist. The inverse of $\mathbf{A}$ is given from the svd, using the familiar rules, as
$$
\mathbf{A}^{-1} = \mathbf{V}\mathbf{\Sigma}^{-1}\mathbf{U}^T. \tag{33}
$$
The evaluation of $\mathbf{\Sigma}^{-1}$ is easy because $\mathbf{\Sigma}$ is square and diagonal. Note that this treatment indicates that the singular values of $\mathbf{A}^{-1}$ are $[\sigma_n^{-1}, \sigma_{n-1}^{-1}, \dots, \sigma_1^{-1}]$.

### 3.4.8 The SVD diagonalizes any system of equations
Consider the system of equations $\mathbf{A}\mathbf{x} = \mathbf{b}$, for an arbitrary matrix $\mathbf{A}$. Using the SVD of $\mathbf{A}$, we have
$$
\mathbf{U}\mathbf{\Sigma}\mathbf{V}^T\mathbf{x} = \mathbf{b}. \tag{34}
$$
Let us now represent $\mathbf{b}$ in the basis $\mathbf{U}$, and $\mathbf{x}$ in the basis $\mathbf{V}$, in the same way as in Sect. 3.6. We therefore have
$$
\mathbf{c} = \underset{r \atop m-r}{\begin{bmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{bmatrix}} = \begin{bmatrix} \mathbf{U}_1^T \\ \mathbf{U}_2^T \end{bmatrix} \mathbf{b} \tag{35}
$$
and
$$
\mathbf{d} = \underset{r \atop n-r}{\begin{bmatrix} \mathbf{d}_1 \\ \mathbf{d}_2 \end{bmatrix}} = \begin{bmatrix} \mathbf{V}_1^T \\ \mathbf{V}_2^T \end{bmatrix} \mathbf{x} \tag{36}
$$
Substituting the above into (34), the system of equations becomes
$$
\mathbf{\Sigma}\mathbf{d} = \mathbf{c}. \tag{37}
$$
This shows that as long as we choose the correct bases, *any* system of equations can become diagonal. This property represents the power of the SVD; it allows us to transform arbitrary algebraic structures into their simplest forms.

If $m > n$ or if rank $r < \min(m,n)$, then the system of equations $\mathbf{A}\mathbf{x} = \mathbf{b}$ can only be satisfied if $\mathbf{b} \in \mathcal{R}(\mathbf{U}_1)$. To see this, $\mathbf{\Sigma}$ above has an $(m-r) \times n$ block of zeros below the diagonal block of nonzero singular values. Thus, the lower $m-r$ elements of left-hand side of (37) are all zero. Then if the equality of (37) is to be satisfied, $\mathbf{c}_2$ must also be zero. This means that $\mathbf{U}_2^T\mathbf{b} = \mathbf{0}$, or that $\mathbf{b} \in \mathcal{R}(\mathbf{U}_1)$.

Further, if $n > m$, or if $r < \min(m,n)$, then, if $\mathbf{x}_o$ is a solution to $\mathbf{A}\mathbf{x} = \mathbf{b}$, $\mathbf{x}_o + \mathbf{V}_2\mathbf{z}$ is also a solution, where $\mathbf{z} \in \mathbb{R}^{n-r}$. This follows because, as we have seen, $\mathbf{V}_2$ is a basis for $\mathcal{N}(\mathbf{A})$; thus, the component $\mathbf{A}\mathbf{V}_2\mathbf{z} = \mathbf{0}$, and $\mathbf{A}\mathbf{x}_o + \mathbf{A}\mathbf{V}_2\mathbf{z} = \mathbf{A}\mathbf{x}_o = \mathbf{b}$.

### 3.4.9 The “rotation” interpretation of the SVD
From the SVD relation $\mathbf{A} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^T$, we have
$$
\mathbf{A}\mathbf{V} = \mathbf{U}\mathbf{\Sigma}. \tag{38}
$$
Note that since $\mathbf{\Sigma}$ is diagonal, the matrix $\mathbf{U}\mathbf{\Sigma}$ on the right has orthogonal columns, whose 2–norm’s are equal to the corresponding singular value. We can therefore interpret the matrix $\mathbf{V}$ as an orthonormal matrix which *rotates* the rows of $\mathbf{A}$ so that the result is a matrix with orthogonal columns. Likewise, we have
$$
\mathbf{U}^T\mathbf{A} = \mathbf{\Sigma}\mathbf{V}^T. \tag{39}
$$
The matrix $\mathbf{\Sigma}\mathbf{V}^T$ on the right has orthogonal rows with 2–norm equal to the corresponding singular value. Thus, the orthonormal matrix $\mathbf{U}^T$ operates (rotates) the columns of $\mathbf{A}$ to produce a matrix with orthogonal rows.

In the case where $m > n$, ($\mathbf{A}$ is tall), then the matrix $\mathbf{\Sigma}$ is also tall, with zeros in the bottom $m-n$ rows. Then, only the first $n$ columns of $\mathbf{U}$ are relevant in (38), and only the first $n$ rows of $\mathbf{U}^T$ are relevant in (39). When $m < n$, a corresponding transposed statement replacing $\mathbf{U}$ with $\mathbf{V}$ can be made.

## 3.5 Relationship between SVD and ED
It is clear that the eigendecomposition and the singular value decomposition share many properties in common. The price we pay for being able to perform a diagonal decomposition on an *arbitray* matrix is that we need two orthonormal matrices instead of just one, as is the case for square symmetric matrices. In this section, we explore further relationships between the ED and the SVD.

Using (25), we can write
$$
\mathbf{A}^T\mathbf{A} = \mathbf{V} \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \mathbf{U}^T\mathbf{U} \begin{bmatrix} \tilde{\mathbf{\Sigma}} & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \mathbf{V}^T = \mathbf{V} \begin{bmatrix} \tilde{\mathbf{\Sigma}}^2 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \mathbf{V}^T. \tag{40}
$$
Thus it is apparent, that the eigenvectors $\mathbf{V}$ of the matrix $\mathbf{A}^T\mathbf{A}$ are the right singular vectors of $\mathbf{A}$, and that the singular values of $\mathbf{A}$ squared are the corresponding nonzero eigenvalues. Note that if $\mathbf{A}$ is short ($m<n$) and full rank, the matrix $\mathbf{A}^T\mathbf{A}$ will contain $n-m$ additional zero eigenvalues that are not included as singular values of $\mathbf{A}$. This follows because the rank of the matrix $\mathbf{A}^T\mathbf{A}$ is $m$ when $\mathbf{A}$ is full rank, yet the size of $\mathbf{A}^T\mathbf{A}$ is $n \times n$.

As discussed in *Golub and van Loan*, the SVD is numerically more stable to compute than the ED. However, in the case where $n >> m$, the matrix $\mathbf{V}$ of the SVD of $\mathbf{A}$ becomes large, which means the SVD on $\mathbf{A}$ becomes more costly to compute, relative to the eigendecomposition of $\mathbf{A}^T\mathbf{A}$.

Further, we can also say, using the form $\mathbf{A}\mathbf{A}^T$, that
$$
\mathbf{A}\mathbf{A}^T = \mathbf{U} \begin{bmatrix} \tilde{\mathbf{\Sigma}}^2 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \mathbf{V}^T\mathbf{V} \begin{bmatrix} \tilde{\mathbf{\Sigma}}^2 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \mathbf{U}^T = \mathbf{U} \begin{bmatrix} \tilde{\mathbf{\Sigma}}^2 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} \end{bmatrix} \mathbf{U}^T \tag{41}
$$
which indicates that the eigenvectors of $\mathbf{A}\mathbf{A}^T$ are the left singular vectors $\mathbf{U}$ of $\mathbf{A}$, and the singular values of $\mathbf{A}$ squared are the nonzero eigenvalues of $\mathbf{A}\mathbf{A}^T$. Notice that in this case, if $\mathbf{A}$ is tall and full rank, the matrix $\mathbf{A}\mathbf{A}^T$ will contain $m-n$ additional zero eigenvalues that are not included as singular values of $\mathbf{A}$.

We now compare the fundamental defining relationships for the ED and the SVD:
For the ED, if $\mathbf{A}$ is symmetric, we have:
$$
\mathbf{A} = \mathbf{Q}\mathbf{\Lambda}\mathbf{Q}^T \rightarrow \mathbf{A}\mathbf{Q} = \mathbf{Q}\mathbf{\Lambda},
$$
where $\mathbf{Q}$ is the matrix of eigenvectors, and $\mathbf{\Lambda}$ is the diagonal matrix of eigenvalues. Writing this relation column-by-column, we have the familiar eigenvector/eigenvalue relationship:
$$
\mathbf{A}\mathbf{q}_i = \lambda_i\mathbf{q}_i \quad i=1, \dots, n. \tag{42}
$$
For the SVD, we have
$$
\mathbf{A} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^T \rightarrow \mathbf{A}\mathbf{V} = \mathbf{U}\mathbf{\Sigma}
$$
or
$$
\mathbf{A}\mathbf{v}_i = \sigma_i\mathbf{u}_i \quad i=1, \dots, p, \tag{43}
$$
where $p=\min(m,n)$. Also, since $\mathbf{A}^T = \mathbf{V}\mathbf{\Sigma}\mathbf{U}^T \rightarrow \mathbf{A}^T\mathbf{U} = \mathbf{V}\mathbf{\Sigma}$, we have
$$
\mathbf{A}^T\mathbf{u}_i = \sigma_i\mathbf{v}_i \quad i=1, \dots, p. \tag{44}
$$
Thus, by comparing (42), (43), and (44), we see the singular vectors and singular values obey a relation which is similar to that which defines the eigenvectors and eigenvalues. However, we note that in the SVD case, the fundamental relationship expresses left singular values in terms of right singular values, and vice-versa, whereas the eigenvectors are expressed in terms of themselves.

**Exercise:** compare the ED and the SVD on a square symmetric matrix, when i) $\mathbf{A}$ is positive definite, and ii) when $\mathbf{A}$ has some positive and some negative eigenvalues.

## 3.6 Ellipsoidal Interpretation of the SVD
The singular values of $\mathbf{A}$, where $\mathbf{A} \in \mathbb{R}^{m \times n}$ are the lengths of the semi-axes of the hyperellipsoid E given by:
$$
E = \{ \mathbf{y} \mid \mathbf{y} = \mathbf{A}\mathbf{x}, \|\mathbf{x}\|_2 = 1 \}.
$$
That is, E is the set of points mapped out as $\mathbf{x}$ takes on all possible values such that $\|\mathbf{x}\|_2 = 1$, as shown in Fig. 1. To appreciate this point, let us look at the set of $\mathbf{y}$ corresponding to $\{\mathbf{x} \mid \|\mathbf{x}\|_2 = 1\}$. We take
$$
\mathbf{y} = \mathbf{A}\mathbf{x} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^T\mathbf{x}. \tag{45}
$$
Let us change bases for both $\mathbf{x}$ and $\mathbf{y}$. Define
$$
\begin{aligned}
\mathbf{c} &= \mathbf{U}^T\mathbf{y} \\
\mathbf{d} &= \mathbf{V}^T\mathbf{x}.
\end{aligned} \tag{46}
$$
Then (45) becomes
$$
\mathbf{c} = \mathbf{\Sigma}\mathbf{d}. \tag{47}
$$

We note that $\|\mathbf{d}\|_2 = 1$ if $\|\mathbf{x}\|_2=1$. Thus, our problem is transformed into observing the set $\{\mathbf{c}\}$ corresponding to the set $\{\mathbf{d} \mid \|\mathbf{d}\|_2=1\}$. The set $\{\mathbf{c}\}$ can be determined by evaluating 2-norms on each side of (47):
$$
\sum_{i=1}^p \left(\frac{c_i}{\sigma_i}\right)^2 = \sum_{i=1}^p (d_i)^2 = 1. \tag{48}
$$
We see that the set $\{\mathbf{c}\}$ defined by (48) is indeed the canonical form of an ellipse in the basis $\mathbf{U}$. Thus, the principal axes of the ellipse are aligned along the columns $\mathbf{u}_i$ of $\mathbf{U}$, with lengths equal to the corresponding singular value $\sigma_i$. This interpretation of the SVD is useful later in our study of *condition numbers*.

## 3.7 An Interesting Theorem
First, we realize that the SVD of $\mathbf{A}$ provides a “sum of outer-products” representation:
$$
\mathbf{A} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^T = \sum_{i=1}^p \sigma_i \mathbf{u}_i \mathbf{v}_i^T, \quad p=\min(m,n). \tag{49}
$$
Given $\mathbf{A} \in \mathbb{R}^{m \times n}$ with rank $r$, then what is the matrix $\mathbf{B} \in \mathbb{R}^{m \times n}$ with rank $k < r$ closest to $\mathbf{A}$ in 2-norm? What is this 2-norm distance? This question is answered in the following theorem:

**Theorem 3** Define
$$
\mathbf{A}_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^T, \quad k \le r, \tag{50}
$$
then
$$
\min_{\text{rank}(\mathbf{B})=k} \|\mathbf{A}-\mathbf{B}\|_2 = \|\mathbf{A}-\mathbf{A}_k\|_2 = \sigma_{k+1}.
$$
In words, this says the closest rank $k < r$ matrix $\mathbf{B}$ matrix to $\mathbf{A}$ in the 2–norm sense is given by $\mathbf{A}_k$. $\mathbf{A}_k$ is formed from $\mathbf{A}$ by excluding contributions in (49) associated with the smallest singular values.

*Proof:*
Since $\mathbf{U}^T\mathbf{A}_k\mathbf{V} = \text{diag}(\sigma_1, \dots, \sigma_k, 0, \dots, 0)$ it follows that $\text{rank}(\mathbf{A}_k)=k$, and that
$$
\begin{aligned}
\|\mathbf{A}-\mathbf{A}_k\|_2 &= \|\mathbf{U}^T(\mathbf{A}-\mathbf{A}_k)\mathbf{V}\|_2 \\
&= \|\text{diag}(0, \dots, 0, \sigma_{k+1}, \dots, \sigma_r, 0, \dots, 0)\|_2 \\
&= \sigma_{k+1}.
\end{aligned} \tag{51}
$$
where the first line follows from the fact the the 2-norm of a matrix is invariant to pre– and post–multiplication by an orthonormal matrix (properties of matrix p-norms, Lecture 2). Further, it may be shown that, for any matrix $\mathbf{B} \in \mathbb{R}^{m \times n}$ of rank $k<r$,[^chapter3-2]
$$
\|\mathbf{A}-\mathbf{B}\|_2 \ge \sigma_{k+1} \tag{52}
$$
Comparing (51) and (52), we see the closest rank $k$ matrix to $\mathbf{A}$ is $\mathbf{A}_k$ given by (50).
$\square$

This result is very useful when we wish to approximate a matrix by another of lower rank. For example, let us look at the Karhunen-Loeve expansion as discussed in Lecture 1. For a sample $\mathbf{x}_n$ of a random process $\mathbf{x} \in \mathbb{R}^m$, we express $\mathbf{x}$ as
$$
\mathbf{x}_i = \mathbf{V}\mathbf{\theta}_i \tag{53}
$$
where the columns of $\mathbf{V}$ are the eigenvectors of the covariance matrix $\mathbf{R}$. We saw in Lecture 2 that we may represent $\mathbf{x}_i$ with relatively few coefficients by setting the elements of $\mathbf{\theta}$ associated with the smallest eigenvalues of $\mathbf{R}$ to zero. The idea was that the resulting distortion in $\mathbf{x}$ would have minimum energy.

This fact may now be seen in a different light with the aid of this theorem. Suppose we retain the $j=r$ elements of a given $\mathbf{\theta}$ associated with the largest $r$ eigenvalues. Let $\tilde{\mathbf{\theta}} \triangleq [\theta_1, \theta_2, \dots, \theta_r, 0, \dots, 0]^T$ and $\tilde{\mathbf{x}} = \mathbf{V}\tilde{\mathbf{\theta}}$. Then
$$
\begin{aligned}\tilde{\mathbf{R}}&=E(\tilde{\mathbf{x}} \tilde{\mathbf{x}}^{T} )\\ &=E(\mathbf{V} \tilde{\mathbf{\theta}} \tilde{\mathbf{\theta}}^{T} \mathbf{V} )\\ &=\mathbf{V} \begin{bmatrix}E|\theta_{1} |^{2}&&&\\ &\ddots&&\\ &&E|\theta_{r} |^{2}&\\ &&&\ddots\\ &&&&0\end{bmatrix} \mathbf{V}^{T}\\ &=\mathbf{V} \tilde{\mathbf{\Lambda}} \mathbf{V}^{T} ,\end{aligned} \tag{54}
$$
where $\tilde{\mathbf{\Lambda}} = \text{diag}[\lambda_1, \dots, \lambda_r, 0, \dots, 0]$. Since $\tilde{\mathbf{R}}$ is positive definite, square and symmetric, its eigendecomposition and singular value decomposition are identical; hence, $\lambda_i = \sigma_i, i=1, \dots, r$. Thus from this theorem, and (54), we know that the covariance matrix $\tilde{\mathbf{R}}$ formed from truncating the K-L coefficients is the closest rank–r matrix to the true covariance matrix $\mathbf{R}$ in the 2–norm sense.

[^chapter3-1]: The concept of *positive definiteness* is discussed next lecture. It means all the eigenvalues are greater than or equal to zero.
[^chapter3-2]: Golub and van Loan pg. 73.

# 4 Orthogonal Projections
## 4.1 Sufficient Conditions for a Projector
Suppose we have a subspace $S = \mathcal{R}(\mathbf{X})$, where $\mathbf{X} = [\mathbf{x}_1 \dots \mathbf{x}_n] \in \mathbb{R}^{m \times n}$ is full rank, $m > n$, and an arbitrary vector $\mathbf{y} \in \mathbb{R}^m$. How do we find a matrix $\mathbf{P} \in \mathbb{R}^{m \times m}$ so that the product $\mathbf{P}\mathbf{y} \in S$?

The matrix $\mathbf{P}$ is referred to as a **projector**. That is, we can project an arbitrary vector $\mathbf{y}$ onto the subspace $S$, by premultiplying $\mathbf{y}$ by $\mathbf{P}$. Note that this projection has non-trivial meaning only when $m > n$. Otherwise, $\mathbf{y} \in S$ already for arbitrary $\mathbf{y}$.

A matrix $\mathbf{P}$ is a projection matrix onto $S$ if:
1. $\mathcal{R}(\mathbf{P}) = S$
2. $\mathbf{P}^2 = \mathbf{P}$
3. $\mathbf{P}^T = \mathbf{P}$

A matrix satisfying condition (2) is called an **idempotent** matrix. This is the fundamental property of a projector.

We now show that these three conditions are *sufficient* for $\mathbf{P}$ to be a projector. An arbitrary vector $\mathbf{y}$ can be expressed as
$$
\mathbf{y} = \mathbf{y}_s + \mathbf{y}_c \tag{55}
$$
where $\mathbf{y}_s \in S$ and $\mathbf{y}_c \in S_{\perp}$ (the orthogonal complement subspace of $S$). We see that $\mathbf{y}_s$ is the desired projection of $\mathbf{y}$ onto $S$. Thus, in mathematical terms, our objective is to show that
$$
\mathbf{P}\mathbf{y} = \mathbf{y}_s. \tag{56}
$$
Because of condition 2, $\mathbf{P}^2 = \mathbf{P}$, hence
$$
\mathbf{P}\mathbf{p}_i = \mathbf{p}_i \quad i=1, \dots, m \tag{57}
$$
where $\mathbf{p}_i$ is a column of $\mathbf{P}$. Because $\mathbf{y}_s \in S$, and also $(\mathbf{p}_1 \dots \mathbf{p}_m) \in S$ (condition 1), then $\mathbf{y}_s$ can be expressed as a linear combination of the $\mathbf{p}_i$’s:
$$
\mathbf{y}_s = \sum_{i=1}^m c_i \mathbf{p}_i, \quad c_i \in \mathbb{R}. \tag{58}
$$
Combining (57) and (58), we have
$$
\mathbf{P}\mathbf{y}_s = \sum_{i=1}^m c_i \mathbf{P}\mathbf{p}_i = \sum_{i=1}^m c_i \mathbf{p}_i = \mathbf{y}_s. \tag{59}
$$
If $\mathcal{R}(\mathbf{P}) = S$ (condition 1), then $\mathbf{P}\mathbf{y}_c = \mathbf{0}$. Hence,
$$
\mathbf{P}\mathbf{y} = \mathbf{P}(\mathbf{y}_s + \mathbf{y}_c) = \mathbf{P}\mathbf{y}_s = \mathbf{y}_s. \tag{60}
$$
i.e., $\mathbf{P}$ projects $\mathbf{y}$ onto $S$, if $\mathbf{P}$ obeys conditions 1 and 2. Furthermore, by repeating the above proof, and using condition 3, we have
$$
\mathbf{y}^T\mathbf{P} \in S
$$
i.e., $\mathbf{P}$ projects both column- and row–vectors onto $S$, by pre- and post-multiplying, respectively. Because this property is a direct consequence of the three conditions above, then these conditions are *sufficient* for $\mathbf{P}$ to be a projector.

## 4.2 A Definition for P
Let $\mathbf{X} = [\mathbf{x}_1 \dots \mathbf{x}_n]$, $\mathbf{x}_i \in \mathbb{R}^m, n < m$ be full rank. Then the matrix $\mathbf{P}$ where
$$
\mathbf{P} = \mathbf{X}(\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T \tag{61}
$$
is a projector onto $S = \mathcal{R}(\mathbf{X})$. Other definitions of $\mathbf{P}$ equivalent to (61) will follow later after we discuss pseudo inverses.

Note that when $\mathbf{X}$ has orthonormal columns, then the projector becomes $\mathbf{X}\mathbf{X}^T \in \mathbb{R}^{m \times m}$, which according to our previous discussion on orthonormal matrices in Chapter 2, is *not* the $m \times m$ identity.

**Exercises:**
- prove (61).
- How is $\mathbf{P}$ in (61) formed if $r = \text{rank}(\mathbf{X}) < n$?

**Theorem 4** *The projector onto $S$ defined by (61) is unique.*

*Proof:*
Let $\mathbf{Y}$ be any other $m \times n$ full rank matrix such that $\mathcal{R}(\mathbf{Y}) = S$. Since $\mathbf{X}$ and $\mathbf{Y}$ are both in $S$, each column of $\mathbf{Y}$ must be a linear combination of the columns of $\mathbf{X}$. Therefore, there exists a full-rank matrix $\mathbf{C} \in \mathbb{R}^{n \times n}$ so that
$$
\mathbf{Y} = \mathbf{X}\mathbf{C}. \tag{62}
$$
The projector $\mathbf{P}_1$ formed from $\mathbf{Y}$ is therefore
$$
\begin{aligned}
\mathbf{P}_1 &= \mathbf{Y}(\mathbf{Y}^T\mathbf{Y})^{-1}\mathbf{Y}^T \\
&= \mathbf{X}\mathbf{C}((\mathbf{X}\mathbf{C})^T\mathbf{X}\mathbf{C})^{-1}(\mathbf{X}\mathbf{C})^T \\
&= \mathbf{X}\mathbf{C}(\mathbf{C}^T\mathbf{X}^T\mathbf{X}\mathbf{C})^{-1}\mathbf{C}^T\mathbf{X}^T \\
&= \mathbf{X}\mathbf{C}\mathbf{C}^{-1}(\mathbf{X}^T\mathbf{X})^{-1}(\mathbf{C}^T)^{-1}\mathbf{C}^T\mathbf{X}^T \\
&= \mathbf{X}(\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T \\
&= \mathbf{P}.
\end{aligned} \tag{63}
$$
Thus, the projector formed from (61) onto $S$ is unique, regardless of the set of vectors used to form $\mathbf{X}$, provided the corresponding matrix $\mathbf{X}$ is full rank and that $\mathcal{R}(\mathbf{X}) = S$.
$\square$

In Section 4.1 we discussed *sufficient* conditions for a projector. This means that while these conditions are enough to specify a projector, there may be other conditions which also specify a projector. But since we have now proved the projector is unique, the conditions in Section 4.1 are also *necessary*.

## 4.3 The Orthogonal Complement Projector
Consider the vector $\mathbf{y}$, and let $\mathbf{y}_s$ be the projection of $\mathbf{y}$ onto our subspace $S$, and $\mathbf{y}_c$ be the projection onto the orthogonal complement subspace $S_{\perp}$. Thus,
$$
\mathbf{y} = \mathbf{y}_s + \mathbf{y}_c = \mathbf{P}\mathbf{y} + \mathbf{y}_c. \tag{64}
$$
Therefore we have
$$
\begin{aligned}
\mathbf{y} - \mathbf{P}\mathbf{y} &= \mathbf{y}_c \\
(\mathbf{I} - \mathbf{P})\mathbf{y} &= \mathbf{y}_c.
\end{aligned} \tag{65}
$$
It follows that if $\mathbf{P}$ is a projector onto $S$, then the matrix $(\mathbf{I} - \mathbf{P})$ is a projector onto $S_{\perp}$. It is easily verified that this matrix satisfies the all required properties for this projector.

## 4.4 Orthogonal Projections and the SVD
Suppose we have a matrix $\mathbf{A} \in \mathbb{R}^{m \times n}$ of rank $r$. Then, using the partitions of eqeqpart, we have these useful relations:
1. $\mathbf{V}_1\mathbf{V}_1^T$ is the orthogonal projector onto $[\mathcal{N}(\mathbf{A})]_{\perp} = \mathcal{R}(\mathbf{A}^T)$.
2. $\mathbf{V}_2\mathbf{V}_2^T$ is the orthogonal projector onto $\mathcal{N}(\mathbf{A})$
3. $\mathbf{U}_1\mathbf{U}_1^T$ is the orthogonal projector onto $\mathcal{R}(\mathbf{A})$
4. $\mathbf{U}_2\mathbf{U}_2^T$ is the orthogonal projector onto $[\mathcal{R}(\mathbf{A})]_{\perp} = \mathcal{N}(\mathbf{A}^T)$

To justify these results, we show each projector listed above satisfies the three conditions for a projector:
1. First, we must show that each projector above is in the range of the corresponding subspace (condition 1). In Sects. 3.4.2 and 3.4.3, we have already verified that $\mathbf{V}_2$ is a basis for $\mathcal{N}(\mathbf{A})$, and that $\mathbf{U}_1$ is a basis for $\mathcal{R}(\mathbf{A})$, as required. It is easy to verify that the remaining two projectors above (no.’s 1 and 4 respectively) also have the appropriate ranges.
2. From the orthonormality property of each of the matrix partitions above, it is easy to see condition 2 (idempotency) holds in each case.
3. Finally, each matrix above is symmetric (condition 3). Therefore, each matrix above is a projector onto the corresponding subspace.

# 5 The Quadratic Form
We introduce the quadratic form by considering the idea of *positive definiteness*. A square matrix $\mathbf{A} \in \mathbb{R}^{n \times n}$ is positive definite if and only if, for any $\mathbf{x} \ne \mathbf{0} \in \mathbb{R}^n$,
$$
\mathbf{x}^T \mathbf{A} \mathbf{x} > 0. \tag{1}
$$
The matrix $\mathbf{A}$ is *positive semi-definite* if and only if, for any $\mathbf{x} \ne \mathbf{0}$ we have
$$
\mathbf{x}^T \mathbf{A} \mathbf{x} \ge 0, \tag{2}
$$
which includes the possibility that $\mathbf{A}$ is rank deficient. The quantity on the left in (1) is referred to as a *quadratic form*, and is a matrix equivalent to the scalar quantity $ax^2$.

It is only the symmetric part of $\mathbf{A}$ which is relevant in a quadratric form. This may be seen as follows. The symmetric part $\mathbf{T}$ of $\mathbf{A}$ is defined as $\mathbf{T} = \frac{1}{2}(\mathbf{A} + \mathbf{A}^T)$, whereas the asymmetric part $\mathbf{S}$ of $\mathbf{A}$ is defined as $\mathbf{S} = \frac{1}{2}(\mathbf{A} - \mathbf{A}^T)$. Then $\mathbf{A} = \mathbf{T} + \mathbf{S}$. It may be verified by direct multiplication that the quadratic form can also be expressed in the form
$$
\mathbf{x}^T \mathbf{A} \mathbf{x} = \sum_{i=1}^n \sum_{j=1}^n a_{ij} x_i x_j. \tag{3}
$$
Because $\mathbf{S}^T = -\mathbf{S}$, the $(i,j)$th term corresponding to the asymmetric part of (3) exactly cancels that corresponding to the $(j,i)$th term. Further, the terms corresponding to $i=j$ are zero for the asymmetric part. Thus the part of the quadratic form corresponding to the asymmetric part $\mathbf{S}$ is zero. Therefore, when considering quadratic forms, it suffices to consider only the symmetric part $\mathbf{T}$ of a matrix. Quadratic forms on positive definite matrices are used very frequently in least-squares and adaptive filtering applications.

**Theorem 1** *A matrix $\mathbf{A}$ is positive definite if and only if all eigenvalues of the symmetric part of $\mathbf{A}$ are positive.*

*Proof:* Since only the symmetric part of $\mathbf{A}$ is relevant, the quadratic form on $\mathbf{A}$ may be expressed as $\mathbf{x}^T \mathbf{A} \mathbf{x} = \mathbf{x}^T \mathbf{V} \mathbf{\Lambda} \mathbf{V}^T \mathbf{x}$ where an eigendecomposition has been performed on the symmetric part of $\mathbf{A}$. Let us define $\mathbf{z} = \mathbf{V}^T \mathbf{x}$. Thus we have
$$
\mathbf{x}^T \mathbf{A} \mathbf{x} = \mathbf{z}^T \mathbf{\Lambda} \mathbf{z} = \sum_{i=1}^n z_i^2 \lambda_i. \tag{4}
$$
Thus (4) is greater than zero for arbitrary $\mathbf{x}$ if and only if $\lambda_i > 0$, $i=1, \dots, n$.
$\square$

From (4), it is easy to verify that the equation $k = \sum_{i=1}^n z_i^2 \lambda_i$, where k is a constant, defines a multi-dimensional ellipse where $\sqrt{k/\lambda_i}$ is the length of the ith principal axis. Since $\mathbf{z} = \mathbf{V}^T \mathbf{x}$ where $\mathbf{V}$ is orthonormal, $\mathbf{z}$ is a rotation transformation on $\mathbf{x}$, and the equation $k = \mathbf{x}^T \mathbf{A} \mathbf{x}$ is a rotated version of (4). Thus $k = \mathbf{x}^T \mathbf{A} \mathbf{x}$ is also an ellipse with principal axes given by $\sqrt{k/\lambda_i}$. In this case, the ith principal axes of the ellipse lines up along the ith eigenvector $\mathbf{v}_i$ of $\mathbf{A}$.

Positive definiteness of $\mathbf{A}$ in the quadratic form $\mathbf{x}^T \mathbf{A} \mathbf{x}$ is the matrix analog to the scalar $a$ being positive in the scalar expression $ax^2$. The scalar equation $y = ax^2$ is a parabola which faces upwards if $a$ is positive. Likewise, the equation $y = \mathbf{x}^T \mathbf{A} \mathbf{x}$ is a multi-dimensional parabola which faces upwards in all directions if $\mathbf{A}$ is positive definite.

**Example:** We now discuss an example to illustrate the above discussion. A three-dimensional plot of $y = \mathbf{x}^T \mathbf{A} \mathbf{x}$ is shown plotted in Fig. 1 for $\mathbf{A}$ given by
$$
\mathbf{A} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}. \tag{5}
$$
The corresponding contour plot is plotted in Fig. 2. Note that this curve is elliptical in cross-section in a plane $y=k$ as discussed above. It may be readily verified that the eigenvalues of $\mathbf{A}$ are $3, 1$ with corresponding eigenvectors $^T$ and $[1, -1]^T$. For $y=k=1$, the lengths of the principal axes of the ellipse are then $1/\sqrt{3}$ and $1$. It is seen from the figure these principal axes are indeed the lengths indicated, and are lined up along the directions of the eigenvectors as required.

We write the ellipse in the form
$$
y = \mathbf{x}^T \mathbf{A} \mathbf{x} = \mathbf{z}^T \mathbf{\Lambda} \mathbf{z} = \sum_{i=1}^n z_i^2 \lambda_i \tag{6}
$$
where $\mathbf{z} = \mathbf{V}\mathbf{x}$ as before. It is seen from Fig. 1 and (6) that, since $\mathbf{A}$ is positive definite, the curve defined by $y = z_i^2 \lambda_i$, for all $z_k, k \ne i$ held constant, is an upward-facing parabola for all $i=1, \dots, n$. (To observe the behaviour of $y$ vs. $z_i$ in this case, we use the vertical axis $y$ and the appropriate eigenvector direction, instead of the usual x-axis direction).
$\square$

**Theorem 2** *A symmetric matrix $\mathbf{A}$ can be decomposed into the form $\mathbf{A} = \mathbf{B}\mathbf{B}^T$ if and only if $\mathbf{A}$ is positive definite or positive semi-definite.*

*Proof:* (Necessary condition) Let us define $\mathbf{z}$ as $\mathbf{B}^T\mathbf{x}$. Then
$$
\mathbf{x}^T \mathbf{A} \mathbf{x} = \mathbf{x}^T \mathbf{B} \mathbf{B}^T \mathbf{x} = \mathbf{z}^T \mathbf{z} \ge 0. \tag{7}
$$
Conversely (sufficient condition) without loss of generality we take an eigendecomposition on the symmetric part of $\mathbf{A}$ as $\mathbf{A} = \mathbf{V} \mathbf{\Lambda} \mathbf{V}^T$. Since $\mathbf{A}$ is positive definite by hypothesis, we can write $\mathbf{A} = (\mathbf{V} \mathbf{\Lambda}^{1/2})(\mathbf{V} \mathbf{\Lambda}^{1/2})^T$. Let us define $\mathbf{B} = \mathbf{V} \mathbf{\Lambda}^{1/2} \mathbf{Q}^T$ where $\mathbf{Q}$ is an arbitrary orthonormal matrix of appropriate size. Then $\mathbf{A} = \mathbf{V} \mathbf{\Lambda}^{1/2} \mathbf{Q}^T \mathbf{Q} (\mathbf{\Lambda}^{1/2})^T \mathbf{V}^T = \mathbf{B}\mathbf{B}^T$.
$\square$

Note that $\mathbf{A}$ in this case can only be positive semi-definite if $\mathbf{A}$ has a non-empty null space. Otherwise, it is strictly positive definite.

The fact that $\mathbf{A}$ can be decomposed into two symmetric factors in this way is the fundamental idea behind the Cholesky factorization, which is a major topic of the following chapter.

## 5.1 The Gaussian Multi-Variate Probability Density Function
Here, we very briefly introduce this topic so we can use this material for an example of the application of the Cholesky decomposition later in this course, and also in least-squares analysis to follow shortly. This topic is a good application of quadratic forms. More detail is provided in several books.[^chapter5-1]

First we consider the uni-variate case of the Gaussian probability distribution function (pdf). The pdf $p(x)$ of a Gaussian-distributed random variable x with mean $\mu$ and variance $\sigma^2$ is given as
$$
p(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp \left[ -\frac{1}{2\sigma^2}(x-\mu)^2 \right]. \tag{8}
$$
This is the familiar bell-shaped curve. It is completely specified by two parameters- the mean $\mu$ which determines the position of the peak, and the variance $\sigma^2$ which determines the width or spread of the curve.

We now consider the more interesting multi-dimensional case. Consider a Gaussian-distributed vector $\mathbf{x} \in \mathbb{R}^n$ with mean $\mathbf{\mu}$ and covariance $\mathbf{\Sigma}$. The multivariate pdf describing the variation of $\mathbf{x}$ is
$$
p(\mathbf{x}) = (2\pi)^{-\frac{n}{2}} |\mathbf{\Sigma}|^{-\frac{1}{2}} \exp \left[ -\frac{1}{2}(\mathbf{x}-\mathbf{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x}-\mathbf{\mu}) \right]. \tag{9}
$$
We can see that the multi-variate case collapses to the uni-variate case when the number of variables becomes one. A plot of $p(\mathbf{x})$ vs. $\mathbf{x}$ is shown in Fig. 3, for $\mathbf{\mu} = \mathbf{0}$ and $\mathbf{\Sigma}$ defined as
$$
\mathbf{\Sigma} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}. \tag{10}
$$
Because the exponent in (9) is a quadratic form, the set of points satisfied by the equation $\frac{1}{2}(\mathbf{x}-\mathbf{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x}-\mathbf{\mu}) = k$ where $k$ is a constant, is an ellipse. Therefore this ellipse defines a contour of equal probability density. The interior of this ellipse defines a region into which an observation will fall with a specified probability $\alpha$ which is dependent on $k$. This probability level $\alpha$ is given as
$$
\alpha = \int_R (2\pi)^{-\frac{n}{2}} |\mathbf{\Sigma}|^{-\frac{1}{2}} \exp \left[ -\frac{1}{2}(\mathbf{x}-\mathbf{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x}-\mathbf{\mu}) \right] d\mathbf{x}. \tag{11}
$$
where $R$ is the interior of the ellipse. Stated another way, an *ellipse* is the region in which any observation governed by the probability distribution (9) will fall with a specified probability level $\alpha$. As $k$ increases, the ellipse gets larger, and $\alpha$ increases. These ellipses are referred to as *joint confidence regions* at probability level $\alpha$.

<center>Figure 3: A Gaussian probability density function.</center>

The covariance matrix $\mathbf{\Sigma}$ controls the shape of the ellipse. Because the quadratic form in this case involves $\mathbf{\Sigma}^{-1}$, the length of the ith principal axis is $\sqrt{2k\lambda_i}$ instead of $\sqrt{2k/\lambda_i}$ as it would be if the quadratic form were in $\mathbf{\Sigma}$. Therefore as the eigenvalues of $\mathbf{\Sigma}$ increase, the size of the joint confidence regions increase (i.e., the spread of the distribution increases) for a given value of $k$.

<center>Figure 4: A Gaussian pdf with a more poorly-conditioned covariance matrix.</center>

Now suppose we let $\mathbf{\Sigma}$ become poorly conditioned in such a way that the variances (main diagonal elements of $\mathbf{\Sigma}$) remain constant. Then the ratio of the largest to smallest principal axes become large, and the ellipse becomes elongated. In this case, the pdf takes on more of the shape shown in Fig. 4, which shows a multi-variate Gaussian pdf for $\mathbf{\mu} = \mathbf{0}$ for a relatively poorly conditioned $\mathbf{\Sigma}$ given as
$$
\mathbf{\Sigma} = \begin{bmatrix} 2 & 1.9 \\ 1.9 & 2 \end{bmatrix}. \tag{12}
$$
Here, because the ellipse describing the joint confidence region is elongated, we see that if one of the variables is known, the distribution of the other variable becomes more concentrated around the value of the first; i.e., knowledge of one variable tells us relatively more about the other. This implies the variables are more highly *correlated* with one another. But we have seen previously that if the variables in a vector random process are highly correlated, then the off-diagonal elements of the covariance matrix become larger, which leads to their eigenvalues becomming more disparate; i.e., the condition number of the covariance matrix becomes worse. It is precisely this poorer condition number that causes the ellipse in Fig. 4 to become elongated.

With this discussion, we we now have gone full circle: a highly correlated system has large off-diagonal elements in its covariance matrix. This leads to a poorly conditioned covariance matrix. But a Gaussian-distributed process with a poorly-conditioned covariance matrix has a joint confidence region that is elongated. In turn, an elongated joint confidence region means the system is highly correlated, which takes us back to the beginning.

Understanding these relationships is a key element in the signal processing rigor.

## 5.2 The Rayleigh Quotient
The *Rayleigh quotient* is a simple mathematical structure that has a great deal of interesting uses. The Rayleigh quotient $r(\mathbf{x})$ is defined as
$$
r(\mathbf{x}) = \frac{\mathbf{x}^T \mathbf{A} \mathbf{x}}{\mathbf{x}^T \mathbf{x}}. \tag{13}
$$
It is easily verified that if $\mathbf{x}$ is the ith eigenvector $\mathbf{v}_i$ of $\mathbf{A}$, (not necessarliy normalized to unit norm), then $r(\mathbf{x}) = \lambda_i$:
$$
\frac{\mathbf{v}_i^T \mathbf{A} \mathbf{v}_i}{\mathbf{v}_i^T \mathbf{v}_i} = \frac{\lambda_i \mathbf{v}_i^T \mathbf{v}_i}{\mathbf{v}_i^T \mathbf{v}_i} = \lambda_i. \tag{14}
$$
In fact, it is easily shown by differentiating $r(\mathbf{x})$ with respect to $\mathbf{x}$, that $\mathbf{x} = \mathbf{v}_i$ is a stationary point of $r(\mathbf{x})$.

Further along this line of reasoning, let us define a subspace $S_k$ as $S_k = \text{span}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$, $k=1, \dots, n$, where $\mathbf{v}_i$ is the ith eigenvector of $\mathbf{A} \in \mathbb{R}^{n \times n}$, where $\mathbf{A}$ is symmetric. Then, a variation of the Courant Fischer minimax theorem[^chapter5-2] says that
$$
\lambda_k = \min_{\mathbf{x} \in S_k, \mathbf{x} \ne \mathbf{0}} \frac{\mathbf{x}^T \mathbf{A} \mathbf{x}}{\mathbf{x}^T \mathbf{x}}. \tag{15}
$$

**Question:** It is easily shown by differentiation that (13) for $r(\mathbf{x}) = \lambda_i$ minimizes $\|\mathbf{A} - \lambda_i\mathbf{I}\mathbf{x}\|_2$. The perturbation theory of Golub and Van Loan says that if $\mathbf{x}$ in (13) is a good approximation to an eigenvector, then $r(\mathbf{x})$ is a good approximation to the corresponding eigenvalue, and vice versa. Starting with an initial estimate $\mathbf{x}_0$ with unit 2-norm, suggest an iteration using (13) which gives an improved estimate of the eigenvector. How can the eigenvalue be found?

This technique is referred to as the *Rayleigh quotient iteration* for computing an eigenvalue and eigenvector. In fact, this iteration is remarkably effective; it can be shown to have cubic convergence.

[^chapter5-1]: e.g., H. Van Trees, "Detection, Estimation and Modulation Theory", Part 1. L.L. Scharf, "Statistical Signal Processing: Detection, Estimation, and Time Series Analysis," pg. 55.
[^chapter5-2]: See Wilkinson, "The Algebraic Eigenvalue Problem", pp. 100-101.


---
license: CC-BY-NC-SA-4.0
---

# SciPy 用户指南

> [!INFO] 
> 原文为 [SciPy User Guide](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/index.html)。对应版本 `1.16.2(stable)`。
> 由 <Icon icon="simple-icons:googlegemini"/>Gemini 2.5 Pro 翻译，请对内容进行甄别。

SciPy 是一个基于 [NumPy](https://numpy.org) 构建的数学算法和便捷函数的集合。它通过为用户提供操作和可视化数据的高级命令和类，为 Python 增添了强大的功能。

## 子包和用户指南

SciPy 被组织成覆盖不同科学计算领域的子包。下表对此进行了总结，并在“描述和用户指南”列中链接了它们的用户指南（如果可用）：

| 子包            | 描述和用户指南                                                                                      |
| :-------------- | :-------------------------------------------------------------------------------------------------- |
| `cluster`       | 聚类算法                                                                                            |
| `constants`     | 物理和数学常数                                                                                      |
| `differentiate` | 有限差分微分工具                                                                                    |
| `fft`           | [傅里叶变换 (scipy.fft)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/fft.html)                 |
| `fftpack`       | 快速傅里叶变换例程 (旧版)                                                                           |
| `integrate`     | [积分 (scipy.integrate)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/integrate.html)           |
| `interpolate`   | [插值 (scipy.interpolate)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/interpolate.html)       |
| `io`            | [文件 IO (scipy.io)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/io.html)                      |
| `linalg`        | [线性代数 (scipy.linalg)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/linalg.html)             |
| `ndimage`       | [多维图像处理 (scipy.ndimage)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/ndimage.html)       |
| `odr`           | 正交距离回归                                                                                        |
| `optimize`      | [优化 (scipy.optimize)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/optimize.html)             |
| `signal`        | [信号处理 (scipy.signal)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/signal.html)             |
| `sparse`        | [稀疏数组 (scipy.sparse)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/sparse.html)             |
| `spatial`       | [空间数据结构和算法 (scipy.spatial)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/spatial.html) |
| `special`       | [特殊函数 (scipy.special)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/special.html)           |
| `stats`         | [统计 (scipy.stats)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/stats.html)                   |

此外，还有针对以下主题的额外用户指南：

*   [ARPACK 稀疏特征值问题](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/arpack.html) - 使用迭代方法求解特征值问题的求解器
*   [压缩稀疏图例程 (scipy.sparse.csgraph)](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/csgraph.html) - 压缩稀疏图例程

有关从 SciPy 子包组织和导入函数的指导，请参阅[从 SciPy 导入函数的指南](https://scipy.github.io/devdocs/reference/index.html#guidelines-for-importing-functions-from-scipy)。

有关并行执行和线程安全支持的信息，请参阅 [SciPy 中的并行执行支持](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/parallel_execution.html#scipy-parallel-execution) 和 [SciPy 中的线程安全](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/thread_safety.html#scipy-thread-safety)。

# 傅里叶变换 (`scipy.fft`)

傅里叶分析是一种将函数表示为周期分量之和，并从这些分量中恢复信号的方法。当函数及其傅里叶变换都被离散化的对应项取代时，它被称为离散傅里叶变换（DFT）。DFT 之所以能成为数值计算的中流砥柱，部分原因在于一种计算它的非常快速的算法，称为快速傅里叶变换（FFT）。高斯（1805）已知该算法，并由Cooley和Tukey以其目前的形式发扬光大^[[CT65] Cooley, James W., and John W. Tukey, 1965, “An algorithm for the machine calculation of complex Fourier series,” *Math. Comput.* 19: 297-301.]。Press等人^[[NR07] Press, W., Teukolsky, S., Vetterline, W.T., and Flannery, B.P., 2007, *Numerical Recipes: The Art of Scientific Computing*, ch. 12-13. Cambridge Univ. Press, Cambridge, UK.]对傅里叶分析及其应用作了通俗易懂的介绍。

## 快速傅里叶变换

### 一维离散傅里叶变换

长度为 $N$ 的序列 `x[n]` 的长度为 $N$ 的FFT `y[k]` 定义为

$$y[k] = \sum_{n=0}^{N-1} e^{-2 \pi j \frac{k n}{N} } x[n] \, ,$$

其逆变换定义如下

$$x[n] = \frac{1}{N} \sum_{k=0}^{N-1} e^{2 \pi j \frac{k n}{N} } y[k] \, .$$

这些变换可以分别通过 `fft` 和 `ifft` 计算，如以下示例所示。

```python
>>> from scipy.fft import fft, ifft
>>> import numpy as np
>>> x = np.array([1.0, 2.0, 1.0, -1.0, 1.5])
>>> y = fft(x)
>>> y
array([ 4.5       +0.j        ,  2.08155948-1.65109876j,
       -1.83155948+1.60822041j, -1.83155948-1.60822041j,
        2.08155948+1.65109876j])
>>> yinv = ifft(y)
>>> yinv
array([ 1.0+0.j,  2.0+0.j,  1.0+0.j, -1.0+0.j,  1.5+0.j])
```

从FFT的定义可以看出

$$y = \sum_{n=0}^{N-1} x[n] \, .$$

在示例中

```python
>>> np.sum(x)
4.5
```

这对应于 $y$。对于偶数 N，元素 $y...y[N/2-1]$ 包含正频率项，元素 $y[N/2]...y[N-1]$ 包含负频率项，按负频率递减的顺序排列。对于奇数 N，元素 $y...y[(N-1)/2]$ 包含正频率项，元素 $y[(N+1)/2]...y[N-1]$ 包含负频率项，按负频率递减的顺序排列。

如果序列 x 是实数值，则正频率的 $y[n]$ 值是负频率的 $y[n]$ 值的共轭（因为频谱是对称的）。通常，只绘制对应于正频率的FFT。

该示例绘制了两个正弦波之和的FFT。

```python
>>> from scipy.fft import fft, fftfreq
>>> import numpy as np
>>> # 采样点数
>>> N = 600
>>> # 采样间隔
>>> T = 1.0 / 800.0
>>> x = np.linspace(0.0, N*T, N, endpoint=False)
>>> y = np.sin(50.0 * 2.0*np.pi*x) + 0.5*np.sin(80.0 * 2.0*np.pi*x)
>>> yf = fft(y)
>>> xf = fftfreq(N, T)[:N//2]
>>> import matplotlib.pyplot as plt
>>> plt.plot(xf, 2.0/N * np.abs(yf[0:N//2]))
>>> plt.grid()
>>> plt.show()
```

![“此代码生成一个 X-Y 图，Y 轴为振幅，X 轴为频率。一条蓝色迹线全程振幅为零，但有两个峰值。较高的第一个峰值在 50 Hz，第二个峰值在 80 Hz。”](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/_images/fft-1.png)

FFT输入信号本质上是截断的。这种截断可以建模为无限信号与矩形窗函数的乘法。在频谱域中，这种乘法变成信号频谱与窗函数频谱的卷积，其形式为 $\sin(x)/x$。这种卷积是导致称为频谱泄漏效应的原因（见^[[WPW] https://en.wikipedia.org/wiki/Window_function]）。使用专用的窗函数对信号进行加窗有助于减轻频谱泄漏。下面的示例使用scipy.signal中的Blackman窗，并显示了加窗的效果（为说明目的，FFT的零分量已被截断）。

```python
>>> from scipy.fft import fft, fftfreq
>>> import numpy as np
>>> # 采样点数
>>> N = 600
>>> # 采样间隔
>>> T = 1.0 / 800.0
>>> x = np.linspace(0.0, N*T, N, endpoint=False)
>>> y = np.sin(50.0 * 2.0*np.pi*x) + 0.5*np.sin(80.0 * 2.0*np.pi*x)
>>> yf = fft(y)
>>> from scipy.signal.windows import blackman
>>> w = blackman(N)
>>> ywf = fft(y*w)
>>> xf = fftfreq(N, T)[:N//2]
>>> import matplotlib.pyplot as plt
>>> plt.semilogy(xf[1:N//2], 2.0/N * np.abs(yf[1:N//2]), '-b')
>>> plt.semilogy(xf[1:N//2], 2.0/N * np.abs(ywf[1:N//2]), '-r')
>>> plt.legend(['FFT', 'FFT w. window'])
>>> plt.grid()
>>> plt.show()
```

![“此代码生成一个 X-Y 对数线性图，Y 轴为振幅，X 轴为频率。第一条迹线是 FFT，在 50 和 80 Hz 有两个峰值，本底噪声约为 1e-2 的振幅。第二条迹线是加窗 FFT，具有相同的两个峰值，但由于窗函数，本底噪声要低得多，约为 1e-7 的振幅。”](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/_images/fft-2.png)

如果序列 x 是复数值，则频谱不再对称。为了简化使用FFT函数的工作，scipy提供了以下两个辅助函数。

函数 `fftfreq` 返回FFT采样频率点。

```python
>>> from scipy.fft import fftfreq
>>> freq = fftfreq(8, 0.125)
>>> freq
array([ 0., 1., 2., 3., -4., -3., -2., -1.])
```

本着同样的精神，函数 `fftshift` 允许交换向量的下半部分和上半部分，使其适合显示。

```python
>>> from scipy.fft import fftshift
>>> x = np.arange(8)
>>> fftshift(x)
array([4, 5, 6, 7, 0, 1, 2, 3])
```

下面的示例绘制了两个复指数的FFT；注意其不对称的频谱。

```python
>>> from scipy.fft import fft, fftfreq, fftshift
>>> import numpy as np
>>> # 信号点数
>>> N = 400
>>> # 采样间隔
>>> T = 1.0 / 800.0
>>> x = np.linspace(0.0, N*T, N, endpoint=False)
>>> y = np.exp(50.0 * 1.j * 2.0*np.pi*x) + 0.5*np.exp(-80.0 * 1.j * 2.0*np.pi*x)
>>> yf = fft(y)
>>> xf = fftfreq(N, T)
>>> xf = fftshift(xf)
>>> yplot = fftshift(yf)
>>> import matplotlib.pyplot as plt
>>> plt.plot(xf, 1.0/N * np.abs(yplot))
>>> plt.grid()
>>> plt.show()
```

![“此代码生成一个 X-Y 图，Y 轴为振幅，X 轴为频率。除了在 -80 和 50 Hz 处的两个尖锐峰值外，该迹线在整个图上均为零值。右侧 50 Hz 的峰值是其两倍高。”](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/_images/fft-3.png)

函数 `rfft` 计算实数序列的FFT，并仅输出频率范围一半的复FFT系数 $y[n]$。剩余的负频率分量由实数输入的FFT的厄米对称性（`y[n] = conj(y[-n])`）所隐含。在 N 为偶数的情况下：$[Re(y) + 0j, y, ..., Re(y[N/2]) + 0j]$；在 N 为奇数的情况下 $[Re(y) + 0j, y, ..., y[N/2]]$。明确显示为 $Re(y[k]) + 0j$ 的项被限制为纯实数，因为根据厄米属性，它们是自身的复共轭。

相应的函数 `irfft` 计算具有这种特殊排序的FFT系数的IFFT。

```python
>>> from scipy.fft import fft, rfft, irfft
>>> x = np.array([1.0, 2.0, 1.0, -1.0, 1.5, 1.0])
>>> fft(x)
array([ 5.5 +0.j        ,  2.25-0.4330127j , -2.75-1.29903811j,
        1.5 +0.j        , -2.75+1.29903811j,  2.25+0.4330127j ])
>>> yr = rfft(x)
>>> yr
array([ 5.5 +0.j        ,  2.25-0.4330127j , -2.75-1.29903811j,
        1.5 +0.j        ])
>>> irfft(yr)
array([ 1. ,  2. ,  1. , -1. ,  1.5,  1. ])
>>> x = np.array([1.0, 2.0, 1.0, -1.0, 1.5])
>>> fft(x)
array([ 4.5       +0.j        ,  2.08155948-1.65109876j,
       -1.83155948+1.60822041j, -1.83155948-1.60822041j,
        2.08155948+1.65109876j])
>>> yr = rfft(x)
>>> yr
array([ 4.5       +0.j        ,  2.08155948-1.65109876j,
        -1.83155948+1.60822041j])
```

注意，奇数和偶数长度信号的 `rfft` 具有相同的形状。默认情况下，`irfft` 假定输出信号应为偶数长度。因此，对于奇数信号，它会给出错误的结果：

```python
>>> irfft(yr)
array([ 1.70788987,  2.40843925, -0.37366961,  0.75734049])
```

为了恢复原始的奇数长度信号，我们**必须**通过 `n` 参数传递输出形状。

```python
>>> irfft(yr, n=len(x))
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

### 2维和N维离散傅里叶变换

函数 `fft2` 和 `ifft2` 分别提供二维FFT和IFFT。同样，`fftn` 和 `ifftn` 分别提供N维FFT和IFFT。

对于实数输入信号，类似于 `rfft`，我们有用于二维实数变换的函数 `rfft2` 和 `irfft2`；用于N维实数变换的 `rfftn` 和 `irfftn`。

下面的示例演示了二维IFFT并绘制了得到的（二维）时域信号。

```python
>>> from scipy.fft import ifftn
>>> import matplotlib.pyplot as plt
>>> import matplotlib.cm as cm
>>> import numpy as np
>>> N = 30
>>> f, ((ax1, ax2, ax3), (ax4, ax5, ax6)) = plt.subplots(2, 3, sharex='col', sharey='row')
>>> xf = np.zeros((N,N))
>>> xf[0, 5] = 1
>>> xf[0, N-5] = 1
>>> Z = ifftn(xf)
>>> ax1.imshow(xf, cmap=cm.Reds)
>>> ax4.imshow(np.real(Z), cmap=cm.gray)
>>> xf = np.zeros((N, N))
>>> xf[5, 0] = 1
>>> xf[N-5, 0] = 1
>>> Z = ifftn(xf)
>>> ax2.imshow(xf, cmap=cm.Reds)
>>> ax5.imshow(np.real(Z), cmap=cm.gray)
>>> xf = np.zeros((N, N))
>>> xf[5, 10] = 1
>>> xf[N-5, N-10] = 1
>>> Z = ifftn(xf)
>>> ax3.imshow(xf, cmap=cm.Reds)
>>> ax6.imshow(np.real(Z), cmap=cm.gray)
>>> plt.show()
```

![“此代码生成六个以 2x3 网格排列的热图。顶行显示了大部分为空的画布，除了每个图像上的两个微小的红色峰值。底行显示了其上方每个图像的傅里叶逆变换的实部。第一列顶部图像中有两个水平排列的点，底部图像中有一个平滑的灰度图，其中有 5 条黑色垂直条纹，代表二维时域信号。第二列顶部图像中有两个垂直排列的点，底部图像中有一个平滑的灰度图，其中有 5 条黑色水平条纹，代表二维时域信号。在最后一列中，顶部图像有两个对角线位置的点；其下方的对应图像大约有 20 条成 60 度角的黑色条纹。”](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/_images/fft-4.png)

## 离散余弦变换

SciPy 通过函数 `dct` 提供 DCT，通过函数 `idct` 提供相应的 IDCT。DCT 有 8 种类型^[[WPC] https://en.wikipedia.org/wiki/Discrete_cosine_transform]^[[Mak] J. Makhoul, 1980, ‘A Fast Cosine Transform in One and Two Dimensions’, *IEEE Transactions on acoustics, speech and signal processing* vol. 28(1), pp. 27-34, DOI:10.1109/TASSP.1980.1163351]；然而，scipy 中只实现了前 4 种类型。“DCT” 通常指 DCT 类型 2，“逆 DCT” 通常指 DCT 类型 3。此外，DCT 系数可以被不同地归一化（对于大多数类型，scipy 提供 `None` 和 `ortho`）。dct/idct 函数调用的两个参数允许设置 DCT 类型和系数归一化。

对于一维数组 x，`dct(x, norm='ortho')` 等同于 MATLAB 的 `dct(x)`。

### I 型 DCT

SciPy 使用以下未归一化的 DCT-I 定义 (`norm=None`):

$$y[k] = x_0 + (-1)^k x_{N-1} + 2\sum_{n=1}^{N-2} x[n] \cos\left(\frac{\pi nk}{N-1}\right), \qquad 0 \le k < N.$$

请注意，DCT-I 仅支持输入大小 > 1。

### II 型 DCT

SciPy 使用以下未归一化的 DCT-II 定义 (`norm=None`):

$$y[k] = 2 \sum_{n=0}^{N-1} x[n] \cos \left({\pi(2n+1)k \over 2N} \right) \qquad 0 \le k < N.$$

在归一化 DCT (`norm='ortho'`) 的情况下，DCT 系数 $y[k]$ 乘以一个缩放因子 *f*:

$$\begin{split}f = \begin{cases} \sqrt{1/(4N)}, & \text{if $k = 0$} \\    \sqrt{1/(2N)}, & \text{otherwise} \end{cases} \, .\end{split}$$

在这种情况下，DCT“基函数” $\phi_k[n] = 2 f \cos \left({\pi(2n+1)k \over 2N} \right)$ 变为正交的：

$$\sum_{n=0}^{N-1} \phi_k[n] \phi_l[n] = \delta_{lk}.$$

### III 型 DCT

SciPy 使用以下未归一化的 DCT-III 定义 (`norm=None`):

$$y[k] = x_0 + 2 \sum_{n=1}^{N-1} x[n] \cos\left({\pi n(2k+1) \over 2N}\right) \qquad 0 \le k < N,$$

或者，对于 `norm='ortho'`:

$$y[k] = {x_0\over\sqrt{N}} + {2\over\sqrt{N}} \sum_{n=1}^{N-1} x[n] \cos\left({\pi n(2k+1) \over 2N}\right) \qquad 0 \le k < N.$$

### IV 型 DCT

SciPy 使用以下未归一化的 DCT-IV 定义 (`norm=None`):

$$y[k] = 2 \sum_{n=0}^{N-1} x[n] \cos\left({\pi (2n+1)(2k+1) \over 4N}\right) \qquad 0 \le k < N,$$

或者，对于 `norm='ortho'`:

$$y[k] = \sqrt{2\over N}\sum_{n=0}^{N-1} x[n] \cos\left({\pi (2n+1)(2k+1) \over 4N}\right) \qquad 0 \le k < N$$

### DCT 和 IDCT

（未归一化的）DCT-III 是（未归一化的）DCT-II 的逆，相差一个因子 `2N`。正交归一化的 DCT-III 正是正交归一化的 DCT-II 的逆。函数 `idct` 执行 DCT 和 IDCT 类型之间的映射，以及正确的归一化。

以下示例显示了不同类型和归一化的 DCT 和 IDCT 之间的关系。

```python
>>> from scipy.fft import dct, idct
>>> x = np.array([1.0, 2.0, 1.0, -1.0, 1.5])
```

DCT-II 和 DCT-III 互为逆，因此对于正交变换，我们返回到原始信号。

```python
>>> dct(dct(x, type=2, norm='ortho'), type=3, norm='ortho')
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

然而，在默认归一化下执行相同操作，我们会得到一个额外的缩放因子 $2N=10$，因为前向变换是未归一化的。

```python
>>> dct(dct(x, type=2), type=3)
array([ 10.,  20.,  10., -10.,  15.])
```

因此，我们应该对两者使用相同类型的函数 `idct`，从而得到正确归一化的结果。

```python
>>> # 归一化逆变换：无缩放因子
>>> idct(dct(x, type=2), type=2)
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

对于 DCT-I 也可以看到类似的结果，它是自身的逆，相差一个因子 $2(N-1)$。

```python
>>> dct(dct(x, type=1, norm='ortho'), type=1, norm='ortho')
array([ 1. ,  2. ,  1. , -1. ,  1.5])
>>> # 通过 DCT-I 的未归一化往返：缩放因子 2*(N-1) = 8
>>> dct(dct(x, type=1), type=1)
array([ 8. ,  16.,  8. , -8. ,  12.])
>>> # 归一化逆变换：无缩放因子
>>> idct(dct(x, type=1), type=1)
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

对于 DCT-IV 也是如此，它也是自身的逆，相差一个因子 $2N$。

```python
>>> dct(dct(x, type=4, norm='ortho'), type=4, norm='ortho')
array([ 1. ,  2. ,  1. , -1. ,  1.5])
>>> # 通过 DCT-IV 的未归一化往返：缩放因子 2*N = 10
>>> dct(dct(x, type=4), type=4)
array([ 10.,  20.,  10., -10.,  15.])
>>> # 归一化逆变换：无缩放因子
>>> idct(dct(x, type=4), type=4)
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

### 示例

DCT 表现出“能量集中特性”，这意味着对于许多信号，只有前几个 DCT 系数具有显着的幅度。将其他系数清零会导致很小的重建误差，这一事实在有损信号压缩（例如 JPEG 压缩）中得到了利用。

下面的示例显示了一个信号 x 和从该信号的 DCT 系数中进行的两种重建（$x_{20}$ 和 $x_{15}$）。信号 $x_{20}$ 是从前 20 个 DCT 系数重建的，$x_{15}$ 是从前 15 个 DCT 系数重建的。可以看出，使用 20 个系数的相对误差仍然非常小（~0.1%），但提供了五倍的压缩率。

```python
>>> from scipy.fft import dct, idct
>>> import matplotlib.pyplot as plt
>>> N = 100
>>> t = np.linspace(0,20,N, endpoint=False)
>>> x = np.exp(-t/3)*np.cos(2*t)
>>> y = dct(x, norm='ortho')
>>> window = np.zeros(N)
>>> window[:20] = 1
>>> yr = idct(y*window, norm='ortho')
>>> sum(abs(x-yr)**2) / sum(abs(x)**2)
0.0009872817275276098
>>> plt.plot(t, x, '-bx')
>>> plt.plot(t, yr, 'ro')
>>> window = np.zeros(N)
>>> window[:15] = 1
>>> yr = idct(y*window, norm='ortho')
>>> sum(abs(x-yr)**2) / sum(abs(x)**2)
0.06196643004256714
>>> plt.plot(t, yr, 'g+')
>>> plt.legend(['x', '$x_{20}$', '$x_{15}$'])
>>> plt.grid()
>>> plt.show()
```

![“此代码生成一个 X-Y 图，显示 Y 轴上的振幅和 X 轴上的时间。第一条蓝色迹线是原始信号，从振幅 1 开始，在绘图期间振荡至振幅 0，类似于频率啁啾。第二条红色迹线是使用 DCT 的 x_20 重建，在高振幅区域紧密跟随原始信号，但在绘图的右侧不清楚。第三条绿色迹线是使用 DCT 的 x_15 重建，不如 x_20 重建精确，但仍与 x 相似。”](https://docs.scipy.org/doc/scipy-1.16.2/tutorial/_images/fft-5.png)

## 离散正弦变换

SciPy 通过函数 `dst` 提供了 DST^[[Mak] J. Makhoul, 1980, ‘A Fast Cosine Transform in One and Two Dimensions’, *IEEE Transactions on acoustics, speech and signal processing* vol. 28(1), pp. 27-34, DOI:10.1109/TASSP.1980.1163351]，并通过函数 `idst` 提供了相应的 IDST。

理论上，对于奇/偶边界条件和边界偏移的不同组合，DST 有 8 种类型^[[WPS] https://en.wikipedia.org/wiki/Discrete_sine_transform]，scipy 中只实现了前 4 种类型。

### I 型 DST

DST-I 假设输入在 n=-1 和 n=N 附近是奇对称的。SciPy 使用以下未归一化的 DST-I 定义 (`norm=None`):

$$y[k] = 2\sum_{n=0}^{N-1} x[n]  \sin\left( \pi {(n+1) (k+1)}\over{N+1} \right), \qquad 0 \le k < N.$$

另请注意，DST-I 仅支持输入大小 > 1。（未归一化的）DST-I 是其自身的逆，相差一个因子 `2(N+1)`。

### II 型 DST

DST-II 假设输入在 n=-1/2 附近是奇对称的，在 n=N 附近是偶对称的。SciPy 使用以下未归一化的 DST-II 定义 (`norm=None`):

$$y[k] = 2 \sum_{n=0}^{N-1} x[n]  \sin\left( {\pi (n+1/2)(k+1)} \over N \right), \qquad 0 \le k < N.$$

### III 型 DST

DST-III 假设输入在 n=-1 附近是奇对称的，在 n=N-1 附近是偶对称的。SciPy 使用以下未归一化的 DST-III 定义 (`norm=None`):

$$y[k] = (-1)^k x[N-1] + 2 \sum_{n=0}^{N-2} x[n] \sin \left( {\pi (n+1)(k+1/2)} \over N \right), \qquad 0 \le k < N.$$

### IV 型 DST

SciPy 使用以下未归一化的 DST-IV 定义 (`norm=None`):

$$y[k] = 2 \sum_{n=0}^{N-1} x[n] \sin\left({\pi (2n+1)(2k+1) \over 4N}\right) \qquad 0 \le k < N,$$

或者，对于 `norm='ortho'`:

$$y[k] = \sqrt{2\over N}\sum_{n=0}^{N-1} x[n] \sin\left({\pi (2n+1)(2k+1) \over 4N}\right) \qquad 0 \le k < N,$$

### DST 和 IDST

以下示例显示了不同类型和归一化的 DST 和 IDST 之间的关系。

```python
>>> from scipy.fft import dst, idst
>>> x = np.array([1.0, 2.0, 1.0, -1.0, 1.5])
```

DST-II 和 DST-III 互为逆，因此对于正交变换，我们返回到原始信号。

```python
>>> dst(dst(x, type=2, norm='ortho'), type=3, norm='ortho')
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

然而，在默认归一化下执行相同操作，我们会得到一个额外的缩放因子 $2N=10$，因为前向变换是未归一化的。

```python
>>> dst(dst(x, type=2), type=3)
array([ 10.,  20.,  10., -10.,  15.])
```

因此，我们应该对两者使用相同类型的函数 `idst`，从而得到正确归一化的结果。

```python
>>> idst(dst(x, type=2), type=2)
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

对于 DST-I 也可以看到类似的结果，它是自身的逆，相差一个因子 $2(N-1)$。

```python
>>> dst(dst(x, type=1, norm='ortho'), type=1, norm='ortho')
array([ 1. ,  2. ,  1. , -1. ,  1.5])
>>>  # 缩放因子 2*(N+1) = 12
>>> dst(dst(x, type=1), type=1)
array([ 12.,  24.,  12., -12.,  18.])
>>>  # 无缩放因子
>>> idst(dst(x, type=1), type=1)
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

对于 DST-IV 也是如此，它也是自身的逆，相差一个因子 $2N$。

```python
>>> dst(dst(x, type=4, norm='ortho'), type=4, norm='ortho')
array([ 1. ,  2. ,  1. , -1. ,  1.5])
>>>  # 缩放因子 2*N = 10
>>> dst(dst(x, type=4), type=4)
array([ 10.,  20.,  10., -10.,  15.])
>>>  # 无缩放因子
>>> idst(dst(x, type=4), type=4)
array([ 1. ,  2. ,  1. , -1. ,  1.5])
```

## 快速汉克尔变换

SciPy 提供了函数 `fht` 和 `ifht` 来对对数间隔的输入数组执行快速汉克尔变换 (FHT) 及其逆变换 (IFHT)。

FHT 是由^[[Ham00] A. J. S. Hamilton, 2000, “Uncorrelated modes of the non-linear power spectrum”, *MNRAS*, 312, 257. DOI:10.1046/j.1365-8711.2000.03071.x]定义的连续汉克尔变换的离散化版本

$$A(k) = \int_{0}^{\infty} \! a(r) \, J_{\mu}(kr) \, k \, dr \;,$$

其中 $J_{\mu}$ 是 $\mu$ 阶贝塞尔函数。在变量替换 $r \to \log r$，$k \to \log k$ 下，这变为

$$A(e^{\log k}) = \int_{0}^{\infty} \! a(e^{\log r}) \, J_{\mu}(e^{\log k + \log r}) \, e^{\log k + \log r} \, d{\log r}$$

这是对数空间中的卷积。FHT 算法使用 FFT 对离散输入数据执行此卷积。

必须注意最小化由于 FFT 卷积的循环性质引起的数值振铃。为确保低振铃条件^[[Ham00] A. J. S. Hamilton, 2000, “Uncorrelated modes of the non-linear power spectrum”, *MNRAS*, 312, 257. DOI:10.1046/j.1365-8711.2000.03071.x]成立，可以使用 `fhtoffset` 函数计算的偏移量对输出数组进行轻微移位。

# 积分 (`scipy.integrate`)

`scipy.integrate` 子包提供了多种积分技术，包括一个常微分方程积分器。通过 help 命令可以获得该模块的概述：

```
>>> help(integrate)
 Methods for Integrating Functions given function object.

   quad          -- General purpose integration.
   dblquad       -- General purpose double integration.
   tplquad       -- General purpose triple integration.
   fixed_quad    -- Integrate func(x) using Gaussian quadrature of order n.
   quadrature    -- Integrate with given tolerance using Gaussian quadrature.
   romberg       -- Integrate func using Romberg integration.

 Methods for Integrating Functions given fixed samples.

   trapezoid            -- Use trapezoidal rule to compute integral.
   cumulative_trapezoid -- Use trapezoidal rule to cumulatively compute integral.
   simpson              -- Use Simpson's rule to compute integral from samples.
   romb                 -- Use Romberg Integration to compute integral from
                        -- (2**k + 1) evenly-spaced samples.

   See the special module's orthogonal polynomials (special) for Gaussian
      quadrature roots and weights for other weighting factors and regions.

 Interface to numerical integrators of ODE systems.

   odeint        -- General integration of ordinary differential equations.
   ode           -- Integrate ODE using VODE and ZVODE routines.
```

## 通用积分 (`quad`)

函数 `quad` 用于计算单变量函数在两个点之间的积分。这两个点可以是 $\pm\infty$ （即代码中的 `± inf`）来表示无穷积分限。例如，假设你希望在区间 $[0, 4.5]$ 上对贝塞尔函数 `jv(2.5, x)` 进行积分。

$$I=\int_{0}^{4.5}J_{2.5}\left(x\right)\, dx.$$

这可以使用 `quad` 来计算：

```python
>>> import scipy.integrate as integrate
>>> import scipy.special as special
>>> result = integrate.quad(lambda x: special.jv(2.5,x), 0, 4.5)
>>> result
(1.1178179380783249, 7.8663172481899801e-09)
```

```python
>>> from numpy import sqrt, sin, cos, pi
>>> I = sqrt(2/pi)*(18.0/27*sqrt(2)*cos(4.5) - 4.0/27*sqrt(2)*sin(4.5) +
...                 sqrt(2*pi) * special.fresnel(3/sqrt(pi))[0])
>>> I
1.117817938088701
```

```python
>>> print(abs(result[0]-I))
1.03761443881e-11
```

`quad` 的第一个参数是一个“可调用”的 Python 对象（即函数、方法或类实例）。注意，在这个例子中，我们使用了一个 lambda 函数作为参数。接下来的两个参数是积分的上下限。返回值是一个元组，第一个元素是积分的估计值，第二个元素是积分绝对误差的估计值。注意，在这种情况下，这个积分的真实值是

$$I=\sqrt{\frac{2}{\pi}}\left(\frac{18}{27}\sqrt{2}\cos\left(4.5\right)-\frac{4}{27}\sqrt{2}\sin\left(4.5\right)+\sqrt{2\pi}\textrm{Si}\left(\frac{3}{\sqrt{\pi}}\right)\right),$$

其中

$$\textrm{Si}\left(x\right)=\int_{0}^{x}\sin\left(\frac{\pi}{2}t^{2}\right)\, dt.$$

是菲涅耳正弦积分。请注意，数值计算的积分结果与精确结果的误差在 $1.04\times10^{-11}$ 之内，远低于报告的误差估计。

如果待积函数需要额外的参数，可以通过 `args` 参数提供。假设需要计算以下积分：

$$I(a,b)=\int_{0}^{1} ax^2+b \, dx.$$

这个积分可以通过以下代码计算：

```python
>>> from scipy.integrate import quad
>>> def integrand(x, a, b):
...     return a*x**2 + b
...
>>> a = 2
>>> b = 1
>>> I = quad(integrand, 0, 1, args=(a,b))
>>> I
(1.6666666666666667, 1.8503717077085944e-14)
```

在 `quad` 中也允许使用无穷积分限，方法是使用 $\pm$ `inf` 作为参数之一。例如，假设需要计算指数积分的数值：

$$E_{n}\left(x\right)=\int_{1}^{\infty}\frac{e^{-xt}}{t^{n}}\, dt.$$

（并且忘记了这个积分可以作为 `special.expn(n,x)` 来计算）。我们可以通过定义一个基于 `quad` 的新函数 `vec_expint` 来复制 `special.expn` 的功能：

```python
>>> from scipy.integrate import quad
>>> import numpy as np
>>> def integrand(t, n, x):
...     return np.exp(-x*t) / t**n
...
```

```python
>>> def expint(n, x):
...     return quad(integrand, 1, np.inf, args=(n, x))[0]
...
```

```python
>>> vec_expint = np.vectorize(expint)
```

```python
>>> vec_expint(3, np.arange(1.0, 4.0, 0.5))
array([ 0.1097,  0.0567,  0.0301,  0.0163,  0.0089,  0.0049])
>>> import scipy.special as special
>>> special.expn(3, np.arange(1.0, 4.0, 0.5))
array([ 0.1097,  0.0567,  0.0301,  0.0163,  0.0089,  0.0049])
```

被积函数甚至可以使用 `quad` 的参数（尽管由于被积函数中使用 `quad` 可能存在数值误差，误差界限可能会低估真实误差）。在这种情况下，积分是

$$I_{n}=\int_{0}^{\infty}\int_{1}^{\infty}\frac{e^{-xt}}{t^{n}}\, dt\, dx=\frac{1}{n}.$$

```python
>>> result = quad(lambda x: expint(3, x), 0, np.inf)
>>> print(result)
(0.33333333324560266, 2.8548934485373678e-09)
```

```python
>>> I3 = 1.0/3.0
>>> print(I3)
0.333333333333
```

```python
>>> print(I3 - result[0])
8.77306560731e-11
```

最后一个例子表明，可以通过重复调用 `quad` 来处理多重积分。

> [!WARNING]
> 数值积分算法在有限数量的点上对被积函数进行采样。因此，它们不能保证对任意的被积函数和积分限都能得到准确的结果（或准确性估计）。例如，考虑高斯积分：
>
> ```python
> >>> def gaussian(x)
> ...     return np.exp(-x**2)
> >>> res = integrate.quad(gaussian, -np.inf, np.inf)
> >>> res
> (1.7724538509055159, 1.4202636756659625e-08)
> >>> np.allclose(res[0], np.sqrt(np.pi))  # compare against theoretical result
> True
> ```
>
> 由于被积函数除了在原点附近外几乎为零，我们期望大的有限积分限会产生相同的结果。然而：
>
> ```python
> >>> integrate.quad(gaussian, -10000, 10000)
> (1.975190562208035e-203, 0.0)
> ```
>
> 发生这种情况是因为在 `quad` 中实现的自适应求积例程，虽然按设计工作，但没有注意到在如此大的有限区间内函数微小但重要的部分。为获得最佳结果，请考虑使用紧密包围被积函数重要部分的积分限。
>
> ```python
> >>> integrate.quad(gaussian, -15, 15)
> (1.772453850905516, 8.476526631214648e-11)
> ```
>
> 具有多个重要区域的被积函数可以根据需要分段处理。

## 通用多重积分 (`dblquad`, `tplquad`, `nquad`)

双重和三重积分的机制已被封装在函数 `dblquad` 和 `tplquad` 中。这些函数分别接受要积分的函数和四个或六个参数。所有内层积分的限度都需要定义为函数。

下面展示了一个使用双重积分计算 $I_{n}$ 几个值的例子：

```python
>>> from scipy.integrate import quad, dblquad
>>> def I(n):
...     return dblquad(lambda t, x: np.exp(-x*t)/t**n, 0, np.inf, lambda x: 1, lambda x: np.inf)
...
```

```python
>>> print(I(4))
(0.2500000000043577, 1.29830334693681e-08)
>>> print(I(3))
(0.33333333325010883, 1.3888461883425516e-08)
>>> print(I(2))
(0.4999999999985751, 1.3894083651858995e-08)
```

作为一个非恒定积分限的例子，考虑积分

$$I=\int_{y=0}^{1/2}\int_{x=0}^{1-2y} x y \, dx\, dy=\frac{1}{96}.$$

这个积分可以使用下面的表达式进行计算（注意内层积分的上限使用了非常量的 lambda 函数）：

```python
>>> from scipy.integrate import dblquad
>>> area = dblquad(lambda x, y: x*y, 0, 0.5, lambda x: 0, lambda x: 1-2*x)
>>> area
(0.010416666666666668, 1.1564823173178715e-16)
```

对于 n 重积分，scipy 提供了函数 `nquad`。积分界限是一个可迭代对象：可以是一个常数界限的列表，或一个非恒定积分界限的函数列表。积分的顺序（因此也是界限的顺序）是从最内层积分到最外层积分。

上面的积分

$$I_{n}=\int_{0}^{\infty}\int_{1}^{\infty}\frac{e^{-xt}}{t^{n}}\, dt\, dx=\frac{1}{n}$$

可以计算为

```python
>>> from scipy import integrate
>>> N = 5
>>> def f(t, x):
...    return np.exp(-x*t) / t**N
...
>>> integrate.nquad(f, [[1, np.inf],[0, np.inf]])
(0.20000000000002294, 1.2239614263187945e-08)
```

注意，*f* 的参数顺序必须与积分界限的顺序匹配；即，关于 $t$ 的内层积分在区间 $[1, \infty]$ 上，而关于 $x$ 的外层积分在区间 $[0, \infty]$ 上。

非恒定积分界限可以以类似的方式处理；上面的例子

$$I=\int_{y=0}^{1/2}\int_{x=0}^{1-2y} x y \, dx\, dy=\frac{1}{96}.$$

可以通过以下方式计算

```python
>>> from scipy import integrate
>>> def f(x, y):
...     return x*y
...
>>> def bounds_y():
...     return [0, 0.5]
...
>>> def bounds_x(y):
...     return [0, 1-2*y]
...
>>> integrate.nquad(f, [bounds_x, bounds_y])
(0.010416666666666668, 4.101620128472366e-16)
```

这与之前的结果相同。

## 高斯求积

`fixed_quad` 在一个固定区间上执行固定阶数的高斯求积。这个函数使用了 `scipy.special` 提供的正交多项式集合，可以计算各种正交多项式的根和求积权重（这些多项式本身可作为返回多项式类实例的特殊函数使用——例如，`special.legendre`）。

## 使用样本进行积分

如果样本是等间距的，并且可用的样本数为 $2^{k}+1$（其中 $k$ 为某个整数），那么可以使用龙贝格积分 `romb` 来获得积分的高精度估计。龙贝格积分在步长为2的幂相关的梯形法则基础上，对这些估计值进行理查森外推，以更高精度的逼近积分。

在任意间距样本的情况下，可以使用 `trapezoid` 和 `simpson` 这两个函数。它们分别使用1阶和2阶的牛顿-柯特斯公式进行积分。梯形法则将相邻点之间的函数近似为一条直线，而辛普森法则将三个相邻点之间的函数近似为一条抛物线。

对于等间距的奇数个样本，如果函数是3次或更低次的多项式，辛普森法则是精确的。如果样本不是等间距的，那么只有当函数是2次或更低次的多项式时，结果才是精确的。

```python
>>> import numpy as np
>>> def f1(x):
...    return x**2
...
>>> def f2(x):
...    return x**3
...
>>> x = np.array([1,3,4])
>>> y1 = f1(x)
>>> from scipy import integrate
>>> I1 = integrate.simpson(y1, x=x)
>>> print(I1)
21.0
```

这完全对应于

$$\int_{1}^{4} x^2 \, dx = 21,$$

然而，对第二个函数进行积分

```python
>>> y2 = f2(x)
>>> I2 = integrate.simpson(y2, x=x)
>>> print(I2)
61.5```

不对应于

$$\int_{1}^{4} x^3 \, dx = 63.75$$

因为 f2 中多项式的阶数大于2。

## 使用底层回调函数进行更快的积分

希望缩短积分时间的用户可以通过 `scipy.LowLevelCallable` 将一个 C 函数指针传递给 `quad`、`dblquad`、`tplquad` 或 `nquad`，它将被积分并在 Python 中返回结果。这里的性能提升来自两个因素。主要的改进是更快的函数求值，这是通过编译函数本身提供的。此外，我们还通过在 `quad` 中移除 C 和 Python 之间的函数调用获得了加速。这种方法对于像正弦这样的简单函数可能会提供约2倍的速度提升，但对于更复杂的函数可以产生更显著的改进（10倍以上）。因此，这个功能面向那些愿意编写少量 C 代码以显著减少计算时间的数值密集型积分用户。

例如，可以通过 `ctypes` 在几个简单的步骤中使用该方法：

1.) 用 C 语言编写一个具有 `double f(int n, double *x, void *user_data)` 函数签名的被积函数，其中 `x` 是一个包含函数 f 求值点的数组，`user_data` 是您想要提供的任意附加数据。

```c
/* testlib.c */
double f(int n, double *x, void *user_data) {
    double c = *(double *)user_data;
    return c + x[0] - x[1] * x[2]; /* 对应 c + x - y * z */
}
```

2.) 现在将此文件编译为共享/动态库（快速搜索将对此有所帮助，因为这取决于操作系统）。用户必须链接任何使用的数学库等。在 Linux 上，这看起来像：

```bash
$ gcc -shared -fPIC -o testlib.so testlib.c
```

输出库将被称为 `testlib.so`，但它可能有不同的文件扩展名。现在已经创建了一个可以用 `ctypes` 加载到 Python 中的库。

3.) 使用 `ctypes` 将共享库加载到 Python 中，并设置 `restypes` 和 `argtypes` - 这使得 SciPy 能够正确解释该函数：

```python
import os, ctypes
from scipy import integrate, LowLevelCallable

lib = ctypes.CDLL(os.path.abspath('testlib.so'))
lib.f.restype = ctypes.c_double
lib.f.argtypes = (ctypes.c_int, ctypes.POINTER(ctypes.c_double), ctypes.c_void_p)

c = ctypes.c_double(1.0)
user_data = ctypes.cast(ctypes.pointer(c), ctypes.c_void_p)

func = LowLevelCallable(lib.f, user_data)
```

函数中的最后一个 `void *user_data` 是可选的，如果不需要可以省略（在 C 函数和 ctypes argtypes 中都可以）。请注意，坐标是作为双精度数组传入的，而不是作为单独的参数。

4.) 现在像往常一样对库函数进行积分，这里使用 `nquad`：

```python
>>> integrate.nquad(func, [[0, 10], [-10, 0], [-1, 1]])
(1200.0, 1.1102230246251565e-11)
```

Python 元组如期在更短的时间内返回。所有可选参数都可以与此方法一起使用，包括指定奇点、无穷界限等。

## 常微分方程 (`solve_ivp`)

给定初始条件，对一组常微分方程（ODEs）进行积分是另一个有用的例子。SciPy 中的 `solve_ivp` 函数可用于对一阶向量微分方程进行积分：

$$\frac{d\mathbf{y}}{dt}=\mathbf{f}\left(\mathbf{y},t\right),$$

给定初始条件 $\mathbf{y}\left(0\right)=\mathbf{y}_{0}$，其中 $\mathbf{y}$ 是一个长度为 $N$ 的向量，$\mathbf{f}$ 是一个从 $\mathbb{R}^{N}$ 到 $\mathbb{R}^{N}$ 的映射。通过将中间导数引入 $\mathbf{y}$ 向量，高阶常微分方程总是可以简化为这种类型的微分方程。

例如，假设希望找到以下二阶微分方程的解：

$$\frac{d^{2}w}{dz^{2}}-zw(z)=0$$

初始条件为 $w\left(0\right)=\frac{1}{\sqrt{3^{2}}\Gamma\left(\frac{2}{3}\right)}$ 和 $\left.\frac{dw}{dz}\right|_{z=0}=-\frac{1}{\sqrt{3}\Gamma\left(\frac{1}{3}\right)}$。已知具有这些边界条件的该微分方程的解是艾里函数

$$w=\textrm{Ai}\left(z\right),$$

这为使用 `special.airy` 检查积分器提供了一种方法。

首先，通过设置 $\mathbf{y}=\left[\frac{dw}{dz},w\right]$ 和 $t=z$，将此 ODE 转换为标准形式。因此，微分方程变为

$$\frac{d\mathbf{y}}{dt}=\left[\begin{array}{c} ty_{1}\\ y_{0}\end{array}\right]=\left[\begin{array}{cc} 0 & t\\ 1 & 0\end{array}\right]\left[\begin{array}{c} y_{0}\\ y_{1}\end{array}\right]=\left[\begin{array}{cc} 0 & t\\ 1 & 0\end{array}\right]\mathbf{y}.$$

换句话说，

$$\mathbf{f}\left(\mathbf{y},t\right)=\mathbf{A}\left(t\right)\mathbf{y}.$$

作为一个有趣的提醒，如果 $\mathbf{A}\left(t\right)$ 与 $\int_{0}^{t}\mathbf{A}\left(\tau\right)\, d\tau$ 在矩阵乘法下可交换，则此线性微分方程具有使用矩阵指数的精确解：

$$\mathbf{y}\left(t\right)=\exp\left(\int_{0}^{t}\mathbf{A}\left(\tau\right)d\tau\right)\mathbf{y}\left(0\right),$$

然而，在这种情况下，$\mathbf{A}\left(t\right)$ 及其积分不可交换。

这个微分方程可以使用函数 `solve_ivp` 求解。它需要导数 `fprime`、时间跨度 `[t_start, t_end]` 和初始条件向量 `y0` 作为输入参数，并返回一个对象，其 `y` 字段是一个数组，其中连续的解值作为列。因此，初始条件在第一个输出列中给出。

```python
>>> from scipy.integrate import solve_ivp
>>> from scipy.special import gamma, airy
>>> y1_0 = +1 / 3**(2/3) / gamma(2/3)
>>> y0_0 = -1 / 3**(1/3) / gamma(1/3)
>>> y0 = [y0_0, y1_0]
>>> def func(t, y):
...     return [t*y[1],y[0]]
...
>>> t_span = [0, 4]
>>> sol1 = solve_ivp(func, t_span, y0)
>>> print("sol1.t: {}".format(sol1.t))
sol1.t:    [0.         0.10097672 1.04643602 1.91060117 2.49872472 3.08684827
 3.62692846 4.        ]
```

可以看到，如果没有另外指定，`solve_ivp` 会自动确定其时间步长。为了将 `solve_ivp` 的解与 `airy` 函数进行比较，将 `solve_ivp` 创建的时间向量传递给 `airy` 函数。

```python
>>> print("sol1.y[1]: {}".format(sol1.y[1]))
sol1.y[1]: [0.35502805 0.328952   0.12801343 0.04008508 0.01601291 0.00623879
 0.00356316 0.00405982]
>>> print("airy(sol.t)[0]:  {}".format(airy(sol1.t)[0]))
airy(sol.t)[0]: [0.35502805 0.328952   0.12804768 0.03995804 0.01575943 0.00562799
 0.00201689 0.00095156]
```

`solve_ivp` 的解与其标准参数显示出与艾里函数的较大偏差。为了最小化这种偏差，可以使用相对和绝对容差。

```python
>>> rtol, atol = (1e-8, 1e-8)
>>> sol2 = solve_ivp(func, t_span, y0, rtol=rtol, atol=atol)
>>> print("sol2.y[1][::6]: {}".format(sol2.y[1][0::6]))
sol2.y[1][::6]: [0.35502805 0.19145234 0.06368989 0.0205917  0.00554734 0.00106409]
>>> print("airy(sol2.t)[0][::6]: {}".format(airy(sol2.t)[0][::6]))
airy(sol2.t)[0][::6]: [0.35502805 0.19145234 0.06368989 0.0205917  0.00554733 0.00106406]
```

要为 `solve_ivp` 的解指定用户定义的时间点，`solve_ivp` 提供了两种也可以互补使用的方法。通过将 `t_eval` 选项传递给函数调用，`solve_ivp` 会在其输出中返回这些时间点 `t_eval` 的解。

```python
>>> import numpy as np
>>> t = np.linspace(0, 4, 100)
>>> sol3 = solve_ivp(func, t_span, y0, t_eval=t)
```

如果函数的雅可比矩阵已知，可以将其传递给 `solve_ivp` 以获得更好的结果。但请注意，默认的积分方法 `RK45` 不支持雅可比矩阵，因此必须选择另一种积分方法。支持雅可比矩阵的积分方法之一是例如以下示例中的 `Radau` 方法。

```python
>>> def gradient(t, y):
...     return [[0,t], [1,0]]
>>> sol4 = solve_ivp(func, t_span, y0, method='Radau', jac=gradient)
```

### 求解带状雅可比矩阵系统

可以告知 `odeint` 雅可比矩阵是*带状的*。对于已知为刚性的大型微分方程系统，这可以显著提高性能。

作为一个例子，我们将使用直线法^[[MOL] https://en.wikipedia.org/wiki/Method_of_lines]求解一维 Gray-Scott 偏微分方程。函数 $u(x, t)$ 和 $v(x, t)$ 在区间 $x \in [0, L]$ 上的 Gray-Scott 方程为

$$
\begin{split}
\frac{\partial u}{\partial t} = D_u \frac{\partial^2 u}{\partial x^2} - uv^2 + f(1-u) \\
\frac{\partial v}{\partial t} = D_v \frac{\partial^2 v}{\partial x^2} + uv^2 - (f + k)v \\
\end{split}
$$

其中 $D_u$ 和 $D_v$ 分别是组分 $u$ 和 $v$ 的扩散系数，$f$ 和 $k$ 是常数。（有关该系统的更多信息，请参阅 http://groups.csail.mit.edu/mac/projects/amorphous/GrayScott/）

我们将假设诺伊曼（即“无通量”）边界条件：

$$\frac{\partial u}{\partial x}(0,t) = 0, \quad
\frac{\partial v}{\partial x}(0,t) = 0, \quad
\frac{\partial u}{\partial x}(L,t) = 0, \quad
\frac{\partial v}{\partial x}(L,t) = 0$$

为了应用直线法，我们通过定义 $N$ 个均匀间隔的网格点 $\left\{x_0, x_1, \ldots, x_{N-1}\right\}$ 来离散化 $x$ 变量，其中 $x_0 = 0$ 和 $x_{N-1} = L$。我们定义 $u_j(t) \equiv u(x_k, t)$ 和 $v_j(t) \equiv v(x_k, t)$，并用有限差分替换 $x$ 的导数。即，

$$\frac{\partial^2 u}{\partial x^2}(x_j, t) \rightarrow
    \frac{u_{j-1}(t) - 2 u_{j}(t) + u_{j+1}(t)}{(\Delta x)^2}$$

然后我们得到一个包含 $2N$ 个常微分方程的系统：

$$
 \begin{split}
 \frac{du_j}{dt} = \frac{D_u}{(\Delta x)^2} \left(u_{j-1} - 2 u_{j} + u_{j+1}\right)
       -u_jv_j^2 + f(1 - u_j) \\
 \frac{dv_j}{dt} = \frac{D_v}{(\Delta x)^2} \left(v_{j-1} - 2 v_{j} + v_{j+1}\right)
       + u_jv_j^2 - (f + k)v_j
 \end{split} \tag{1}
$$

为方便起见，省略了 $(t)$ 参数。

为了实施边界条件，我们引入“虚拟”点 $x_{-1}$ 和 $x_N$，并定义 $u_{-1}(t) \equiv u_1(t)$，$u_N(t) \equiv u_{N-2}(t)$；$v_{-1}(t)$ 和 $v_N(t)$ 的定义类似。

然后

$$
\begin{split}
 \frac{du_0}{dt} = \frac{D_u}{(\Delta x)^2} \left(2u_{1} - 2 u_{0}\right)
       -u_0v_0^2 + f(1 - u_0) \\
 \frac{dv_0}{dt} = \frac{D_v}{(\Delta x)^2} \left(2v_{1} - 2 v_{0}\right)
       + u_0v_0^2 - (f + k)v_0
 \end{split} \tag{2}
$$

并且

$$
 \begin{split}
 \frac{du_{N-1}}{dt} = \frac{D_u}{(\Delta x)^2} \left(2u_{N-2} - 2 u_{N-1}\right)
       -u_{N-1}v_{N-1}^2 + f(1 - u_{N-1}) \\
 \frac{dv_{N-1}}{dt} = \frac{D_v}{(\Delta x)^2} \left(2v_{N-2} - 2 v_{N-1}\right)
       + u_{N-1}v_{N-1}^2 - (f + k)v_{N-1}
 \end{split} \tag{3}
$$

我们完整的 $2N$ 个常微分方程系统是 (1) 对于 $k = 1, 2, \ldots, N-2$，以及 (2) 和 (3)。

我们现在可以开始在代码中实现这个系统。我们必须将 $\{u_k\}$ 和 $\{v_k\}$ 合并成一个长度为 $2N$ 的单个向量。两个明显的选择是 $\{u_0, u_1, \ldots, u_{N-1}, v_0, v_1, \ldots, v_{N-1}\}$ 和 $\{u_0, v_0, u_1, v_1, \ldots, u_{N-1}, v_{N-1}\}$。从数学上讲，这没有关系，但这个选择会影响 `odeint` 求解系统的效率。原因在于顺序如何影响雅可比矩阵中非零元素的模式。

当变量排序为 $\{u_0, u_1, \ldots, u_{N-1}, v_0, v_1, \ldots, v_{N-1}\}$ 时，雅可比矩阵的非零元素模式为

```
   * * 0 0 0 0 0    * 0 0 0 0 0 0
   * * * 0 0 0 0    0 * 0 0 0 0 0
   0 * * * 0 0 0    0 0 * 0 0 0 0
   0 0 * * * 0 0    0 0 0 * 0 0 0
   0 0 0 * * * 0    0 0 0 0 * 0 0
   0 0 0 0 * * *    0 0 0 0 0 * 0
   0 0 0 0 0 * *    0 0 0 0 0 0 *
   * 0 0 0 0 0 0    * * 0 0 0 0 0
   0 * 0 0 0 0 0    * * * 0 0 0 0
   0 0 * 0 0 0 0    0 * * * 0 0 0
   0 0 0 * 0 0 0    0 0 * * * 0 0
   0 0 0 0 * 0 0    0 0 0 * * * 0
   0 0 0 0 0 * 0    0 0 0 0 * * *
   0 0 0 0 0 0 *    0 0 0 0 0 * *
```

当变量交错为 $\{u_0, v_0, u_1, v_1, \ldots, u_{N-1}, v_{N-1}\}$ 时，雅可比矩阵模式为

```
   * * * 0 0 0 0 0 0 0 0 0 0 0
   * * 0 * 0 0 0 0 0 0 0 0 0 0
   * 0 * * * 0 0 0 0 0 0 0 0 0
   0 * * * 0 * 0 0 0 0 0 0 0 0
   0 0 * 0 * * * 0 0 0 0 0 0 0
   0 0 0 * * * 0 * 0 0 0 0 0 0
   0 0 0 0 * 0 * * * 0 0 0 0 0
   0 0 0 0 0 * * * 0 * 0 0 0 0
   0 0 0 0 0 0 * 0 * * * 0 0 0
   0 0 0 0 0 0 0 * * * 0 * 0 0
   0 0 0 0 0 0 0 0 * 0 * * * 0
   0 0 0 0 0 0 0 0 0 * * * 0 *
   0 0 0 0 0 0 0 0 0 0 * 0 * *
   0 0 0 0 0 0 0 0 0 0 0 * * *
```

在这两种情况下，都只有五个非平凡的对角线，但当变量交错时，带宽要小得多。也就是说，主对角线以及主对角线正上方和正下方的两条对角线是非零对角线。这很重要，因为 `odeint` 的输入 `mu` 和 `ml` 是雅可比矩阵的上、下带宽。当变量交错时，`mu` 和 `ml` 均为 2。当变量按 $\{v_k\}$ 跟在 $\{u_k\}$ 之后堆叠时，上、下带宽为 $N$。

做出这个决定后，我们可以编写实现微分方程系统的函数。

首先，我们定义系统源项和反应项的函数：

```python
def G(u, v, f, k):
    return f * (1 - u) - u*v**2

def H(u, v, f, k):
    return -(f + k) * v + u*v**2
```

接下来，我们定义计算微分方程系统右侧的函数：

```python
def grayscott1d(y, t, f, k, Du, Dv, dx):
    """
    一维 Gray-Scott 方程的微分方程。
    
    这些 ODE 是使用直线法推导的。
    """
    # 向量 u 和 v 在 y 中交错。我们通过
    # 切片 y 来定义 u 和 v 的视图。
    u = y[::2]
    v = y[1::2]

    # dydt 是此函数的返回值。
    dydt = np.empty_like(y)

    # 就像 u 和 v 是 y 中交错向量的视图一样，
    # dudt 和 dvdt 是 dydt 中交错输出向量的视图。
    dudt = dydt[::2]
    dvdt = dydt[1::2]

    # 计算 du/dt 和 dv/dt。端点和内部点
    # 分别处理。
    dudt[0]    = G(u[0],    v[0],    f, k) + Du * (-2.0*u[0] + 2.0*u[1]) / dx**2
    dudt[1:-1] = G(u[1:-1], v[1:-1], f, k) + Du * np.diff(u,2) / dx**2
    dudt[-1]   = G(u[-1],   v[-1],   f, k) + Du * (- 2.0*u[-1] + 2.0*u[-2]) / dx**2
    dvdt[0]    = H(u[0],    v[0],    f, k) + Dv * (-2.0*v[0] + 2.0*v[1]) / dx**2
    dvdt[1:-1] = H(u[1:-1], v[1:-1], f, k) + Dv * np.diff(v,2) / dx**2
    dvdt[-1]   = H(u[-1],   v[-1],   f, k) + Dv * (-2.0*v[-1] + 2.0*v[-2]) / dx**2

    return dydt
```

我们不会实现一个计算雅可比矩阵的函数，但我们会告诉 `odeint` 雅可比矩阵是带状的。这允许底层求解器（LSODA）避免计算它知道为零的值。对于大型系统，这可以显著提高性能，如下面的 ipython 会话所示。

首先，我们定义所需的输入：

```python
In [30]: rng = np.random.default_rng()

In [31]: y0 = rng.standard_normal(5000)

In [32]: t = np.linspace(0, 50, 11)

In [33]: f = 0.024

In [34]: k = 0.055

In [35]: Du = 0.01

In [36]: Dv = 0.005

In [37]: dx = 0.025
```

在不利用雅可比矩阵带状结构的情况下计时计算：

```python
In [38]: %timeit sola = odeint(grayscott1d, y0, t, args=(f, k, Du, Dv, dx))
1 loop, best of 3: 25.2 s per loop
```

现在设置 `ml=2` 和 `mu=2`，这样 `odeint` 就知道雅可比矩阵是带状的：

```python
In [39]: %timeit solb = odeint(grayscott1d, y0, t, args=(f, k, Du, Dv, dx), ml=2, mu=2)
10 loops, best of 3: 191 ms per loop
```

这快多了！

让我们确保它们计算出了相同的结果：

```python
In [41]: np.allclose(sola, solb)
Out[41]: True
```
Markdown 是一种轻量级标记语言，能让你用**简单的符号**写出格式丰富的文档。

你可以使用 `#` 来表示不同等级的标题：

# 一级标题
## 二级标题
### 三级标题

*斜体* 使用星号或下划线；**加粗** 使用双星号或双下划线。

Markdown 支持 TeX 数学公式，既可以行内 $E = m c^2$，又可以行间：

$$
e^{i\theta} = \cos\theta + i \sin\theta
$$

对于无序列表：

- 苹果
- 香蕉
- 橘子

还有有序列表：

1. 第一项
2. 第二项
3. 第三项

访问外部链接 [VitePress](https://vitepress.dev) 以及引用外部文件也不在话下：

![本站图标](./logo-light.svg)

你可以用 `` ` `` 包裹代码，例如：`print("Hello World")`；

也可以像这样：

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

> Markdown 也支持引用文本。

表格也非常直观：

| 姓名 | 年龄 | 职业 |
| ----- | -- | --- |
| Alice | 25 | 工程师 |
| Bob   | 30 | 设计师 |

---
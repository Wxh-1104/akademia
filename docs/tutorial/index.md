## Rust 的变量及其遮蔽机制

变量默认是不可变的，但可以通过 `let` 关键字重新绑定一个变量名来实现变量的遮蔽（shadowing）。遮蔽允许你在同一作用域内使用相同的变量名，而不会引起冲突。

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {}", x); // 输出 5

    let x = x + 1; // 这里的 x 遮蔽了外层的 x
    println!("The value of x is: {}", x); // 输出 6

    {
        let x = x * 2; // 这里的 x 遮蔽了外层的 x
        println!("The value of x in the inner scope is: {}", x); // 输出 12
    }

    println!("The value of x is: {}", x); // 输出 6，外层的 x 没有被改变
}
```

## Rust 的整型字面值写法

可以直接在数字后指定类型后缀来定义整型字面值：例如 `42u8`、`42i32`、`42isize` 等。

允许使用下划线来分隔数字以提高可读性，例如 `1_000_000`。

## 整型溢出

Rust 在编译时会检查整型溢出，并在发现溢出时抛出错误。在运行时，如果启用了 `debug` 模式，Rust 会在发生溢出时 panic；如果在 `release` 模式下，Rust 会进行环绕（wrapping）操作。

## 浮点型

所有的浮点型都是有符号的。

## 数学运算

整数除法会向零舍入到最接近的整数。

```rust
fn main() {
    let truncated = -5 / 3; // 结果为 -1
}
```

## 字符类型

用单引号声明 char 字面值，而与之相反的是，使用双引号声明字符串字面值。

## 复合类型：元组与数组

元组是一个将多个不同类型的值组合进一个复合类型的主要方式。元组长度固定：一旦声明，其长度不会增大或缩小。

我们使用包含在圆括号中的逗号分隔的值列表来创建一个元组。

使用 let 解构元组，它将一个元组拆成了若干部分，这样我们就可以将元组的各个部分绑定到不同的变量上。

```rust
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup; // 解构元组

    println!("The value of y is: {y}");
}
```

也可以使用点号（.）后跟值的索引来直接访问所需的元组元素。

```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

不带任何值的元组有个特殊的名称，叫做单元（unit）元组。这种值以及对应的类型都写作 `()`。如果表达式不返回任何其他值，则会隐式返回单元值。

Rust 中的数组长度是固定的。我们将数组的值写成在方括号内，用逗号分隔的列表，例如 `[1, 2, 3]`。

当你确定元素个数不会改变时，数组会很有用。但是数组并不如 vector 类型灵活。vector 类型是标准库提供的一个 允许 增长和缩小长度的类似数组的集合类型。当不确定是应该使用数组还是 vector 的时候，那么很可能应该使用 vector。

创建每个元素都相同的数组可以通过在方括号中指定初始值加分号再加元素个数的方式来实现，例如 `[3; 5]` 表示创建一个包含 5 个值为 3 的元素的数组。

当尝试用索引访问一个元素时，Rust 会检查指定的索引是否小于数组的长度。如果索引超出了数组长度，Rust 会 panic。

## 函数

Rust 代码中的函数和变量名使用 snake case 规范风格。在 snake case 中，所有字母都是小写并使用下划线分隔单词。

Rust 不关心函数定义所在的位置，只要函数被调用时出现在调用之处可见的作用域内就行（也就是说函数定义可以在调用该函数之后再进行）。

当函数拥有参数（形参）时，可以为这些参数提供具体的值（实参）。在函数签名中，必须声明每个参数的类型。当定义多个参数时，使用逗号分隔。

```rust
fn main() {
    print_labeled_measurement(5, 'h');
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {value}{unit_label}");
}
```

## 语句与表达式

函数定义也是语句，调用函数并不是语句。语句不返回值，因此不能把 let 语句赋值给另一个变量。


函数调用是一个表达式。宏调用是一个表达式。用大括号创建的一个新的块作用域也是一个表达式。表达式会计算出一个值。表达式的结尾没有分号。如果在表达式的结尾加上分号，它就变成了语句，而语句不会返回值。

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1 // 注意这里没有分号
    };

    println!("The value of y is: {y}");
}
```

函数可以向调用它的代码返回值。我们并不对返回值命名，但要在箭头（->）后声明它的类型。在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。使用 return 关键字和指定值，可从函数中提前返回；但大部分函数隐式的返回最后的表达式。

```rust
fn five() -> i32 {
    5
}

fn main() {
    let x = five(); // 等同于 let x = 5;

    println!("The value of x is: {x}");
}
```

## 控制流

### if 表达式

所有的 if 表达式都以 if 关键字开头，其后跟一个条件。代码中的条件必须是 bool 值。

可以将 else if 表达式与 if 和 else 组合来实现多重条件。

因为 if 是一个表达式，我们可以在 let 语句的右侧使用它。

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}"); // The value of number is: 5
}
```

if 的每个分支的可能的返回值都必须是相同类型，如果它们的类型不匹配，则会出现一个错误。

```rust
fn main() {
    let condition = true;

    let number = if condition { 5 } else { "six" }; // 错误：if 和 else 分支的类型不匹配

    println!("The value of number is: {number}");
}
```

### 循环

Rust 有三种循环：loop、while 和 for。

loop 关键字告诉 Rust 一遍又一遍地执行一段代码直到你明确要求停止。使用 break 关键字来告诉程序何时停止循环。continue 关键字告诉程序跳过这个循环迭代中的任何剩余代码，并转到下一个迭代。

可以在用于停止循环的 break 表达式后添加你希望返回的值，这个值就会作为循环的返回值返回。

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2; // counter * 2 作为循环的返回值
        }
    };

    println!("The result is {result}"); // The result is 20
}
```

如果存在嵌套循环，break 和 continue 默认应用于此时最内层的循环。可以选择在一个循环上指定一个循环标签（loop label），然后将标签与 break 或 continue 一起使用，这样可以应用在指定循环上。

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop { // 外层循环 counting_up
        println!("count = {count}");
        let mut remaining = 10;

        loop { // 内层循环
            println!("remaining = {remaining}");
            if remaining == 9 {
                break; // 退出内层循环
            }
            if count == 2 {
                break 'counting_up; // 退出外层循环
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

while 条件循环：当条件为 true，执行循环。当条件不再为 true，循环结束。

除此以外，还可以使用 while 结构遍历集合中的元素，比如数组。

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;

    while index < 5 {
        println!("the value is: {}", a[index]);

        index += 1;
    }
}
```

相比于 while 循环，更推荐使用 for 循环来遍历集合中的元素，因为 for 循环更简洁且不易出错。

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

for 循环的优势之一是可以使用 Range，它是标准库提供的类型，用来生成从一个数字开始到另一个数字之前结束的所有数字的序列。可以使用 rev来反转这个序列。

```rust
fn main() {
    for number in 1..4 {
        println!("{number}!"); // 输出 1! 2! 3!
    }

    for number in (1..4).rev() {
        println!("{number}!"); // 输出 3! 2! 1!
    }
}
```

## 所有权

所有权（ownership）是 Rust 用于如何管理内存的一组规则。

栈和堆都是代码在运行时可供使用的内存，但是它们的结构不同。栈遵循后进先出的原则，栈中的所有数据都必须占用已知且固定的大小。而堆是缺乏组织的，向堆放入数据时，你要请求一定大小的空间。内存分配器（memory allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的指针，该过程称作在堆上分配内存（allocating on the heap），有时简称为 “分配”（allocating）。（将数据推入栈中并不被认为是分配）。入栈比在堆上分配内存要快，访问堆上的数据比访问栈上的数据慢。所有权的主要目的就是管理堆数据。

所有权的规则如下：

1. Rust 中的每一个值都有一个所有者（owner）。
2. 值在任一时刻有且只有一个所有者。
3. 当所有者离开作用域，这个值将被丢弃。

作用域是一个项（item）在程序中有效的范围。变量从声明的点开始直到当前作用域结束时都是有效的。当变量离开作用域后，Rust 自动调用 drop 函数并清理变量的堆内存。

字符串字面值是不可变的，并不适合使用文本的每一种场景。Rust 有另一种字符串类型：String。这个类型管理被分配到堆上的数据，能够存储在编译时未知大小的文本。可以使用 from 函数基于字符串字面值来创建 String。

```rust
let mut s = String::from("hello");

s.push_str(", world!"); // push_str() 在字符串后追加字面值

println!("{s}"); // 输出 "hello, world!"
```

多个变量可以采取不同的方式与同一数据进行交互。例如

```rust
let x = 5;
let y = x;
```

这里因为整数是有已知固定大小的简单值，x 的值拷贝到 y 中，这两个 5 都被压入了栈中。但下面的情况不同：

```rust
let s1 = String::from("hello");
let s2 = s1;
// println!("{}, world!", s1); // 这里会报错，因为 s1 的所有权被移动到 s2
```

第一条语句实际上发生了如下的事情：指向存放字符串内容内存的指针、长度和容量这一组数据存储在栈上，堆上存放内容 hello。

```
         s1
+----------+-------+       +-------+-------+
|   name   | value |       | index | value |
+----------+-------+       +-------+-------+
|   ptr    |   ----------> |   0   |   h   |
+----------+-------+       +-------+-------+
|   len    |   5   |       |   1   |   e   |
+----------+-------+       +-------+-------+
| capacity |   5   |       |   2   |   l   |
                           +-------+-------+
                           |   3   |   l   |
                           +-------+-------+
                           |   4   |   o   |
                           +-------+-------+
```

将 s1 赋值给 s2 时，Rust 从栈上拷贝了它的指针、长度和容量，但并没有复制指针指向的堆上数据。由于当 s2 和 s1 离开作用域时，它们都会尝试释放相同的内存。两次释放（相同）内存会导致内存污染，可能导致潜在的安全漏洞。为了确保内存安全，在 let s2 = s1; 之后，Rust 认为 s1 不再有效，因此无法使用 s1。这个行为被称为移动（move）。

由于任何值在任一时刻有且只有一个所有者，这里相当于 s1 的所有权被移动到了 s2。

Rust 永远也不会自动创建数据的 “深拷贝”（拷贝指针、长度和容量，而且拷贝数据本身）。如果确实需要深拷贝，可以使用 String 类型的 clone 方法。

```rust
let s1 = String::from("hello");
let s2 = s1.clone(); // 不光拷贝栈上的数据，还拷贝了堆上的数据

println!("s1 = {s1}, s2 = {s2}");
```

如果一个类型实现了 Copy trait，那么一个旧的变量在将其赋值给其他变量后仍然有效。类似整型这样的存储在栈上的类型都实现了 Copy trait。
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

向函数传递值可能会移动或者复制，就像赋值语句一样。

```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值移动到函数里 ...
    // println!("{}", s); 这里会报错，因为 s 的所有权被移动了

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 应该移动到函数里，但由于 i32 是 Copy 的类型
    println!("{}", x);              // 所以在后面可继续使用 x

} // 这里，应该是 x 先移出了作用域，然后是 s。但因为 s 的值已被移走，因此没有特殊之处

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{some_string}");
} // 这里，some_string 移出作用域并调用 `drop` 方法。

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{some_integer}");
} // 这里，some_integer 移出作用域。没有特殊之处
```

返回值也可以转移所有权。

```rust
fn main() {
    let s1 = gives_ownership();        // gives_ownership 将它的返回值传递给 s1

    let s2 = String::from("hello");    // s2 进入作用域

    let s3 = takes_and_gives_back(s2); // s2 被传入 takes_and_gives_back，它的返回值又传递给 s3
} // 此处，s3 移出作用域并被丢弃。s2 被 move，s1 移出作用域并被丢弃

fn gives_ownership() -> String { // gives_ownership 将会把返回值传入调用它的函数
    let some_string = String::from("yours"); // some_string 进入作用域
    some_string // 返回 some_string 并将其移至调用函数
}

// 该函数将传入字符串并返回该值
fn takes_and_gives_back(a_string: String) -> String {
    // a_string 进入作用域
    a_string  // 返回 a_string 并移出给调用的函数
}
```

### 引用与借用

Rust 提供了一个不用获取所有权就可以使用值的功能，叫做引用（references）。引用像一个指针，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据。但与指针不同，引用在其生命周期内保证指向某个特定类型的有效值。用符号 & 来表示引用。将创建一个引用的行为称为借用（borrowing）。

当函数使用引用而不是实际值作为参数，无需返回值来交还所有权，因为就不曾拥有所有权。

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1); // 传入一个指向值 s1 的引用，但是并不拥有它

    println!("The length of '{s1}' is {len}.");
}

fn calculate_length(s: &String) -> usize { // s 是 String 的引用
    s.len()
} // s 在这里离开作用域，但因为它并不拥有引用的值的所有权，所以什么也不会发生
```

正如变量默认是不可变的，引用也一样。（默认）不允许修改引用的值。但是可以通过可变引用（mutable reference）让我们修改引用指向的值。

```rust
fn main() {
    let mut s = String::from("hello"); // s 必须是可变的

    change(&mut s); // 传入 s 的可变引用
}

fn change(some_string: &mut String) { // some_string 是 String 的可变引用
    some_string.push_str(", world"); // 修改引用指向的值
}
```

可变引用有很大的限制：如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用。也不能在拥有不可变引用的同时拥有可变引用。然而，多个不可变引用是可以的，因为不可变引用只能读取数据，不会影响其他引用者读取到的数据。这一限制以一种非常小心谨慎的方式允许可变性，防止同一时间对同一数据存在多个可变引用。好处是 Rust 可以在编译时就避免数据竞争（data race）。

```rust
let mut s = String::from("hello");

let r1 = &s; // 没问题
let r2 = &s; // 没问题
let r3 = &mut s; // 编译错误，因为不能在拥有不可变引用的同时拥有可变引用
```

一个引用的作用域从声明的地方开始一直持续到最后一次使用为止。编译器可以在作用域结束之前判断不再使用的引用。

```rust
let mut s = String::from("hello");

let r1 = &s; // 没问题
let r2 = &s; // 没问题
println!("{r1} and {r2}"); // 这是最后一次使用 r1 和 r2
// 此位置之后 r1 和 r2 不再使用，所以它们的作用域到此结束

let r3 = &mut s; // 虽然不能在拥有不可变引用的同时拥有可变引用，但是这里不会发生编译错误
println!("{r3}");
```

在 Rust 中编译器确保引用永远也不会变成悬垂引用：当你拥有一些数据的引用，编译器确保数据不会在其引用之前离开作用域。

```rust
fn dangle() -> &String { // dangle 函数返回一个字符串的引用
    let s = String::from("hello"); // s 是一个新字符串

    &s // 返回字符串 s 的引用
} // 这里 s 离开作用域并被丢弃，其内存被释放。编译错误，因为它试图返回一个指向已被释放内存的引用
```

综上，在任意给定时间，要么只能有一个可变引用，要么只能有多个不可变引用。引用必须总是有效的。

### 切片（Slice）

切片（slice）允许你引用集合中一段连续的元素序列，而不用引用整个集合。slice 是一种引用，所以它不拥有所有权。

字符串 slice（string slice）是 String 中一部分值的引用，它看起来像这样：

```rust
let s = String::from("hello world");

let hello = &s[0..5]; // 从索引 0 开始时，也可以不写两个点号之前的值，即 &s[..5]
let world = &s[6..11]; // 到最后一个字节结束时，也可以不写两个点号之后的值，即 &s[6..]
// 整个字符串 slice 可以省略两头的值，写作 &s[..]
```

此时的切片结构如下：

```
         s
+----------+-------+      +-------+-------+
|   name   | value |      | index | value |
+----------+-------+      +-------+-------+
|   ptr    |   ----------->   0   |   h   |
+----------+-------+      +-------+-------+
|   len    |   11  |      |   1   |   e   |
+----------+-------+      +-------+-------+
| capacity |   11  |      |   2   |   l   |
+----------+-------+      +-------+-------+
                          |   3   |   l   |
                          +-------+-------+
       world              |   4   |   o   |
+----------+-------+      +-------+-------+
|   name   | value |      |   5   |       |
+----------+-------+      +-------+-------+
|   ptr    |   ----------->   6   |   w   |
+----------+-------+      +-------+-------+
|   len    |   5   |      |   7   |   o   |
+----------+-------+      +-------+-------+
                          |   8   |   r   |
                          +-------+-------+
                          |   9   |   l   |
                          +-------+-------+
                          |  10   |   d   |
                          +-------+-------+
```

字符串 slice range 的索引必须位于有效的 UTF-8 字符边界内，如果尝试从一个多字节字符的中间位置创建字符串 slice，则程序将会因错误而退出。

字符串字面值实际是一个指向二进制程序特定位置的 slice，类型是 &str，因此字符串字面值是不可变的，因为 &str 是一个不可变引用。

字符串 slice 作为参数可以接收 String 或 &str，因为它们都可以被视为字符串 slice。

除了字符串切片（&str），还可以创建数组切片。

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..4]; // 创建一个指向数组 a 中元素 2、3、4 的切片
// 这个 slice 的类型是 &[i32]，它会存储第一个集合元素的引用和一个集合总长度
assert_eq!(slice, &[2, 3]); // 断言 slice 的值是否等于 &[2, 3]
```

## 结构体

结构体（struct 或 structure），是一种自定义数据类型，允许你包装和命名多个相关的值，从而形成一个有意义的组合。

和元组一样，结构体的每一部分可以是不同类型。但不同于元组，结构体需要命名各部分数据以便能清楚的表明其值的意义。因此，结构体不需要依赖顺序来指定或访问实例中的值。

定义结构体时，需要使用 struct 关键字并为整个结构体命名。在后面的花括号中，定义每一部分数据的名字和类型，我们称为字段（field）。

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
} // 如果在函数体内定义结构体，结尾处需要加分号

struct User_updated {
    active: mut bool, // 报错，不能在定义结构体时将某个字段标记为 mut
    username: String,
    email: String,
    sign_in_count: u64,
}
```

一旦定义了结构体，为了使用它，需要创建这个结构体的实例。创建实例时以结构体的名字开头，接着在花括号中使用 key: value 的形式提供字段。不能在定义结构体时将任一字段标记为 mut。

默认情况下，实例是不可变的。若整个实例是可变的，则各个字段均为可变。

```rust
let user1 = User { // 创建一个 User 结构体的不可变实例 user1
    active: true,
    username: String::from("example_user"),
    email: String::from("user1@example.com"),
    sign_in_count: 1, // 各个字段的顺序无关紧要
};

user1.email = String::from("user1_updated@example.com"); // 报错，user1 是不可变实例，无法修改字段

let mut user2 = User { // 创建一个 User 结构体的可变实例 user2
    active: true,
    username: String::from("another_user"),
    email: String::from("user2@example.com"),
    sign_in_count: 2,
};

user2.email = String::from("user2_updated@example.com"); // user2 是可变实例，可以修改字段
```

函数可以返回结构体的实例，这可以通过在最后一个表达式中构造一个结构体的新实例来隐式返回它。如果函数的参数名与字段名都完全相同，可以使用字段初始化简写语法（field init shorthand）

```rust
fn build_user(email: String, username: String) -> User { //函数参数名与 User 字段名相同
    User {
        active: true,
        username, // 等价于 username: username,
        email, // 等价于 email: email,
        sign_in_count: 1,
    }
}
```

可以借助其他已有实例来创建新的实例，这种语法叫做结构体更新语法（struct update syntax）。使用 `已有实例.字段名` 语法来使用其他实例的字段值；使用 `..已有实例名` 语法来复制另一实例的其余字段值，注意此时必须放在最后。

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("username1"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    let user2 = User {
        active: user1.active, // 从 user1 复制 active 字段
        username: String::from("username2"),
        email: String::from("user2@example.com"),
        sign_in_count: user1.sign_in_count, // 从 user1 复制 sign_in_count 字段
    };

    let user3 = User {
        email: String::from("user3@example.com"),
        ..user1 // 表示 user3 的其余字段与 user1 相同
    };
}
```

由于以上两种方式会将字段值从旧实例移动到新实例（相当于 `=` 赋值），因此如果旧实例的某个字段值没有实现 Copy trait，则旧实例的该字段将不再有效。

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("username1"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    let user2 = User {
        username: String::from("username2"), // 这是新的 username 字段，不会影响 user1.username
        ..user1 // 这里会发生所有权的移动
    };

    println!("{}", user1.username); // 不会报错，因为 user2 创建了新的 username 字段

    println!("{}", user2.email); // user2 的 email 字段值为 "someone@example.com"

    println!("{}", user1.email); // 报错，user1 的 email 字段值已被移动到 user2

    println!("{}", user1.sign_in_count); // 不会报错，因为 sign_in_count 实现了 Copy trait，所以值被复制而不是被移动
}
```

你可以继续访问那些所有权未被移动的字段，但你不能再访问那些所有权已经被移动的字段。并且你不能再将旧实例作为一个整体来使用（例如 `let user4 = user1;`）。

可以使结构体存储被其他对象拥有的数据的引用，不过这么做的话需要指定生命周期（lifetimes）。生命周期确保结构体引用的数据有效性跟结构体本身保持一致。如果你尝试在结构体中存储一个引用而不指定生命周期将是无效的。

```rust
struct User {
    active: bool,
    username: &str, // 报错，结构体中存储了一个引用，但没有指定生命周期
    email: &str, // 报错，结构体中存储了一个引用，但没有指定生命周期
    sign_in_count: u64,
}
```

### 元组结构体（tuple structs）

当你想给整个元组取一个名字，并使元组成为与其他元组不同的类型时，元组结构体是很有用的。元组结构体有着结构体名称，但没有具体的字段名，只有字段的类型。

定义元组结构体时，以 struct 关键字和结构体名开头，后跟元组中的类型。

元组结构体实例类似于元组，你可以将它们解构为单独的部分，也可以使用 `.索引` 来访问单独的值。与元组不同的是，解构元组结构体时必须写明结构体的类型。

```rust
fn main() {
    struct Point(i32, i32, i32);
    struct Color(i32, i32, i32); // 定义两个元组结构体 Point 和 Color

    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0); // 创建 Point 和 Color 的实例
    // 即使它们的字段类型和数量相同，它们仍然是不同的类型

    let (x, y, z) =  origin; // 报错，必须写明结构体的类型
    let Point(x, y, z) = origin; // 不会报错，解构 Point 结构体实例

    println!("{}", origin.0); // 使用 `.索引` 访问字段值
}
```

类单元结构体（unit-like structs）是一个没有任何字段的结构体。它们类似于 `()` 类型。类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用。定义和实例化类单元结构体的语法极其简单，不需要花括号或圆括号。

```rust
struct AlwaysEqual; // 定义一个类单元结构体 AlwaysEqual

fn main() {
    let subject = AlwaysEqual; // 创建 AlwaysEqual 的实例
}
```

### 方法

方法（method）与函数类似：它们都使用 fn 关键字和名称声明，可以拥有参数和返回值，同时包含在某处调用该方法时会执行的代码。不过方法与函数也有不同，方法在结构体的上下文中被定义，或者是枚举或 trait 对象的上下文被定义，而且第一个参数总是 `self` ——代表调用该方法的结构体实例。

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle { // 为 Rectangle 结构体定义方法
    fn area(&self) -> u32 { // 方法的第一个参数是 &self，self 代表当前 impl 块类型（即 Rectangle）的实例
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area() // 采用方法语法（method syntax）调用 Rectangle 的 area 方法
    );
}
```

这里，使用一个 impl 块来定义 Rectangle 结构体的方法，这个 impl 块中的所有内容都将与 Rectangle 类型相关联。`&self` 实际上是 `self: &Self` 的缩写。在一个 `impl` 块中，`Self` 类型是 `impl` 块的类型的别名。方法的第一个参数必须有一个名为 `self` 的 `Self` 类型的参数，只能用 `self` 这个名字来简化。

之所以选择 `&self` 是因为我们并不想获取所有权，只希望能读取结构体中的数据，而不是写入。如果想要在方法中改变调用方法的实例，需要将第一个参数改为 `&mut self`。

方法的名称可以与结构体其中一个字段名相同。Rust 能区分何时调用方法（加圆括号），何时访问字段（不加圆括号）。

每个结构体都允许拥有多个 `impl` 块。

```rust
impl Rectangle {
    fn width(&self) -> bool { // 方法名称与某一字段名称 width 相同
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    if rect1.width() { //这里调用 width 方法返回的布尔值
        println!("The rectangle has a nonzero width; it is {}", rect1.width); // 这里访问 width 字段的值
    }
}
```

Rust 具备自动引用和解引用（automatic referencing and dereferencing）的功能，方法调用是少数几种体现这种功能的地方之一。例如创建一个 `Rectangle` 实例 `rect1` 后再通过 `let rect = &rect1;` 来创建一个指向 `rect1` 的引用，此时能直接使用 `rect.area()` 来调用 `area` 方法，而不需要写成 `(*rect).area()`。Rust 会自动为我们添加解引用操作符。同理，Rust 还会自动添加 `&`、`&mut` 以便与方法签名匹配。

### 关联函数

所有在 `impl` 块中定义的函数被称为关联函数（associated functions），因为它们与 `impl` 后面的类型相关。我们可以定义不以 `self` 为第一参数的关联函数（因此就不是方法），因为它们并不作用于一个结构体的实例，而是作用于整个结构体类型。要调用这种关联函数，我们使用 `结构体名::关联函数名` 语法。

不是方法的关联函数经常被用作是返回一个结构体新实例的构造函数。它们总是被命名为 `new`，因为 `new` 不是关键字，可以作为函数名。

```rust
impl Rectangle {
    fn square(size: u32) -> Self { // 由于不以 self 为第一参数，它不是方法而是关联函数
        Self {
            width: size,
            height: size,
        } // 返回一个新的 Rectangle 实例，表明其作为构造函数的身份
    }
}

fn main() {
    let sq = Rectangle::square(3); // 调用关联函数 square，这里作为构造函数返回一个 Rectangle 实例

    println!(
        "The area of the square is {} square pixels.",
        sq.area()
    );
}
```

关键字 `Self` 在函数的返回类型和函数体中，都是对 `impl` 关键字后所示类型的别名。

## 枚举

结构体给予你将字段和数据聚合在一起的方法，而枚举给予你一个途径去声明某个值是一个集合中的一员。枚举出所有可能的值被称为枚举的变体（variants）。使用 `enum` 关键字来定义枚举。

```rust
enum IpAddrKind { // 定义一个枚举 IpAddrKind
    V4,
    V6, // V4 和 V6 是 IpAddrKind 的两个变体，没有关联任何数据
}
```

这样就可以创建变体的实例，例如 `let six = IpAddrKind::V6;`。枚举的变体位于其标识符的命名空间中，并使用两个冒号分开。

也可以定义函数来接收任何枚举类型的参数：`fn route(ip_kind: IpAddrKind) {}`。然后可以将任何 `IpAddrKind` 变体的实例传递给这个函数。

可以将枚举变体与数据一同放在结构体中，或者将数据直接放进每一个枚举变体而不是将枚举作为结构体的一部分。若是后者，每一个我们定义的枚举变体的名字也变成了一个构建枚举实例的函数。

```rust
enum IpAddr {
    V4(String), // V4 变体携带一个 String 类型的数据
    V6(String), // V6 变体携带一个 String 类型的数据
}

fn main() {
    let home = IpAddr::V4(String::from("127.0.0.1")); // IpAddr::V4() 是一个获取 String 参数并返回 IpAddr 类型实例的函数
    let loopback = IpAddr::V6(String::from("::1"));
}
```

枚举相比结构体还有另一个优势：每个变体可以处理不同类型和数量的数据。

```rust
struct V6Addr {
    // ...
}

enum IpAddr {
    V4(u8, u8, u8, u8), // V4 变体携带四个 u8 类型的数据
    V6(V6Addr), // V6 变体携带一个 V6Addr 结构体类型的数据
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
}
```

结构体和枚举还有另一个相似点：可以使用 `impl` 来在枚举上定义方法。

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) { // 定义一个方法 call
        // ...
    }
}

fn main() {
    let m = Message::Write(String::from("hello")); // 创建 Message 枚举的一个实例
    m.call(); // 调用 Message 枚举实例的方法
}
```

### Option 枚举

`Option` 是标准库定义的另一个枚举。其应用广泛因为它编码了一个非常普遍的场景，即一个值要么有值要么没值。因为 Rust 并没有很多其他语言中有的空值功能，因为引入空值会带来很多问题，但是仍需要一种方式来表示因为某种原因目前无效或缺失的值。因此，Rust 拥有一个定义于标准库中，可以编码存在或不存在概念的枚举——`Option<T>`

```rust
enum Option<T> {
    None,
    Some(T),
}
```

无需将 `Option<T>` 显式引入作用域，它的变体也是如此：可以不需要 `Option::` 前缀来直接使用 `Some` 和 `None`，这是较之其他枚举的一个特殊之处。

`<T>` 语法是一个泛型类型参数，意味着 `Option` 枚举的 `Some` 变体可以包含任意类型的数据。

```rust
// 无需将 Option<T> 显式引入作用域
fn main() {
    let some_number = Some(5); // some_number 的类型是 Option<i32>
    let some_char = Some('e'); // some_char 的类型是 Option<char>

    let absent_number: Option<i32> = None;
    // 由于编译器只通过 None 值无法推断出 Some 变体保存的值的类型，因此需要显式指定类型
}
```

`Option<T>` 和 `T` 是不同的类型，它们之间无法直接操作，因此在对 `Option<T>` 进行运算之前必须将其转换为 `T`，通常这能帮助我们捕获到空值最常见的问题之一：假设某值不为空但实际上为空的情况。这限制了空值的泛滥以增加 Rust 代码的安全性。

### match 控制流结构

控制流运算符 `match` 允许我们将一个值与一系列的模式相比较，并根据相匹配的模式执行相应代码。模式可由字面值、变量、通配符和许多其他内容构成。

`match` 关键字后跟一个表达式（表达式可以是任意类型，并不像 `if` 那样一定是布尔值）。接下来花括号内是 `match` 的分支。一个分支有两个部分：一个模式和一些代码。`=>` 运算符将模式和将要运行的代码分开。分支之间使用逗号分隔。

当 `match` 后的表达式执行时，它将结果值按顺序与每一个分支的模式相比较。如果模式匹配了这个值，这个模式相关联的代码将被执行。每个分支相关联的代码是一个表达式，若该分支匹配成功，其结果将作为整个 `match` 表达式的值立即返回。

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin { // match 表达式是枚举实例 coin
        Coin::Penny => {
            println!("Lucky penny!");
            1 // 这里的表达式值为 1
        }
        Coin::Nickel => 5, // 这里的表达式值为 5
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

可以将 `match` 与枚举搭配，从而提取枚举变体中携带的数据。

```rust
#[derive(Debug)] // 这样可以立刻看到州的名称，因为我们使用了 {:?} 来打印枚举
enum UsState {
    Alabama,
    Alaska,
    // ...
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState), // Quarter 变体携带一个 UsState 类型的数据
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => { // 变量 state 将绑定到 Quarter 变体携带的数据上
            println!("State quarter from {state:?}!"); // 提取出 state，即枚举实例 coin 携带的数据
            25
        }
    }
}
// 如果调用 value_in_cents(Coin::Quarter(UsState::Alaska))
// state 就绑定在 UsState::Alaska 上
```

`match` 也可以匹配 `Option<T>` 枚举。

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None, // 如果 x 是 None，则返回 None
            Some(i) => Some(i + 1), // 如果 x 是 Some(i)，则返回 Some(i + 1)
                                    // 这里 i 绑定在 Some 内部的 i32 值上
        }
    }

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}
```

match 需要注意：分支必须覆盖了所有的可能性，也就是说匹配必须是穷尽的，必须穷举到最后的可能性来使代码有效。可以使用通配模式来匹配所有尚未被列出的情况。

```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(), // 这里匹配了 3 和 7 两种情况
        other => move_player(other), // 使用我们命名的变量 other 来匹配其他所有情况
                                     // 即便我们没有列出 u8 所有情况
    }

    // 匹配结果是执行以下三个函数之一
    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}
```

必须将通配分支放在最后。如果我们在通配分支后添加其他分支，Rust 将会警告我们此后的分支永远不会被匹配到。

Rust 还提供了一个模式，当我们不想使用通配模式获取的值时，使用 `_` 可以匹配任意值而不绑定到该值。

```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(), // 使用 _ 来匹配其他所有情况，我们不需要此时的值
        // 或者这里用单元值：_ => (), 表示不执行任何操作
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn reroll() {}
```

### if let / let else 控制流结构

`if let` 语法用于处理只匹配一个模式的值而忽略其他模式的情况，因为此时 `match`会显得冗长。获取通过等号分隔的一个模式和一个表达式。

```rust
fn main() {
    let config_max = Some(3u8);

    // 使用 match 语法来处理
    match config_max {
        Some(max) => println!("The maximum is configured to be {max}"),
        _ => (), // 不需要此时的匹配值，也不需要执行任何操作
    }

    // 使用 if let 语法简化上面的 match
    if let Some(max) = config_max { // `if let 模式 = 表达式` 语法
        println!("The maximum is configured to be {max}");
    }
}
```

使用 `if let` 意味着编写更少代码，更少的缩进和更少的样板代码。但是会失去 `match` 强制要求的穷尽性检查。这是一个权衡取舍的问题。

如果需要对其他情况执行某些操作，可以添加一个 `else` 块。这相当于将 match 的 `_` 分支加入对应代码。

```rust
fn main() {
    let mut count = 0;
    match coin {
        Coin::Quarter(state) => println!("State quarter from {state:?}!"),
        _ => count += 1, // 对于其他情况不再是无操作
    }

    // 使用 if let 语法简化上面的 match
    if let Coin::Quarter(state) = coin {
        println!("State quarter from {state:?}!");
    } else { // else 块中的代码与 match 的 `_` 分支相同
        count += 1;
    }
}
```

`let...else` 语法类似 `if let`，`let` 后跟 `模式 = 表达式`，不过它没有 `if` 分支，只有 `else` 分支。如果模式匹配，它会将匹配到的值绑定到外层作用域。如果模式不匹配，程序流会指向 `else` 分支。

```rust
#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
    // ...
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn describe_quarter(coin: Coin) -> Option<String> {
    let Coin::Quarter(state) = coin else { // let 模式 = 表达式 else
                                           // 如果模式匹配，会将匹配值绑定到 state 上，方便后续处理
                                           // 如果不匹配，程序流会直接指向 else 块
        println!("Not a quarter!");
        return None; // 返回 Option 枚举的 None 变体
    };

    Some(format!("State quarter from {state:?}!")) // 返回 Option 枚举的 Some 变体
    // 这里使用了前面与匹配值绑定的 state 变量
}
```

## 包、Crate 和模块

Rust 有许多功能可以让你管理代码的组织，包括哪些细节可以被公开，哪些细节作为私有部分，以及程序中各个作用域中有哪些名称。这些特性有时被统称为 “模块系统（the module system）”，包括：

1. 包（Packages）：Cargo 的一个功能，它允许你构建、测试和分享 crate。
2. Crates ：一个模块的树形结构，它形成了库或可执行文件项目。
3. 模块（Modules）和 use：允许你控制作用域和路径的私有性。
4. 路径（path）：一个为例如结构体、函数或模块等项命名的方式。

### 包和 Crate

crate 是 Rust 在编译时最小的代码单位。crate 有两种形式：二进制 crate 和库 crate。

1. 二进制 crate（Binary crates）可以被编译为可执行程序，它们必须有一个 `main` 函数。
2. 库 crate（Library crates）并没有 `main` 函数，也不会编译为可执行程序。相反它们定义了可供多个项目复用的功能模块。

crate root 是一个源文件，Rust 编译器以它为起始点，并构成你的 crate 的根模块。

包（package）是提供一系列功能的一个或者多个 crate 的捆绑。一个包包含一个 `Cargo.toml` 文件，其阐述如何去构建这些 crate。

- Cargo 实际上就是一个包。
- 包中可以包含任意多个二进制 crate，至多包含一个库 crate，但必须至少包含一个 crate（无论是库的还是二进制的）。

使用 `cargo new` 指令创建一个包时，会自动生成 `Cargo.toml` 和 `src/main.rs` 等文件。

- Cargo 遵循着一个约定：`src/main.rs` 是一个与包同名的二进制 crate 的 crate 根。
- 如果包目录中包含 `src/lib.rs`，则包带有与其同名的库 crate，且 `src/lib.rs` 是 crate 根。
- 如果一个包同时含有 `src/main.rs` 和 `src/lib.rs`，则它有两个 crate：一个二进制的和一个库的，且名字都与包相同。
- crate 根文件将由 Cargo 传递给 rustc 来实际构建库或者二进制项目。

通过将文件放在 `src/bin` 目录下，一个包可以拥有多个二进制 crate，且每个 `src/bin` 下的文件都会被编译成一个独立的二进制 crate。

### 模块

模块让我们可以将一个 crate 中的代码进行分组，并且控制代码的私有性。

当编译一个 crate, 编译器首先在 crate 根文件（通常，对于一个库 crate 而言是 `src/lib.rs`，对于一个二进制 crate 而言是 `src/main.rs`）中寻找需要被编译的代码。

在 crate 根文件中，你可以使用 `mod 模块名;` 声明一个新模块。编译器会在下列路径中寻找模块代码：

1. 内联，用大括号替换 `mod 模块名` 后跟的分号。
2. 在文件 `src/模块名.rs`。
3. 在文件 `src/模块名/mod.rs`。

在除了 crate 根节点以外的任何文件中，你可以定义子模块。编译器会在以父模块命名的目录中寻找子模块代码。例如在 `src/模块名.rs` 中声明 `mod 子模块名;`，编译器会在下列路径中寻找子模块代码：

1. 内联，用大括号替换 `mod 子模块名` 后跟的分号。
2. 在文件 `src/模块名/子模块名.rs`。
3. 在文件 `src/模块名/子模块名/mod.rs`。

一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。引用方式为 `crate::模块名::子模块名::...::项名`，例如 `crate::garden::vegetables::Asparagus`。

一个模块里的代码默认对其父模块私有。为了使一个模块公用，应当在声明时使用 `pub mod` 替代 `mod`。为了使一个公用模块内部的成员公用，应当在声明前使用 `pub`。

在一个作用域内，`use` 关键字创建了一个项的快捷方式，用来减少长路径的重复。在任何可以引用 `crate::模块名::子模块名::...::项名` 的作用域，你可以通过 `use crate::模块名::子模块名::...::项名;` 创建一个快捷方式，然后你就可以在作用域中只写 `项名` 来使用该类型。例如：

```
文件结构如下：
backyard
├── Cargo.lock
├── Cargo.toml
└── src
    ├── garden
    │   └── vegetables.rs
    ├── garden.rs
    └── main.rs

其中，crate 根文件是 src/main.rs
```

```rust
// src/main.rs
use crate::garden::vegetables::Asparagus; // 这里用 use 创建了一个使用 Asparagus 的快捷方式
                                          // 这样后面就只需要写 Asparagus 了
                                          // 不需要每次都写完整路径 crate::garden::vegetables::Asparagus 了

pub mod garden; // 声明 garden 公用模块，编译器会在 src/garden.rs 中寻找模块代码并包含进来

fn main() {
    let plant = Asparagus {}; // 使用 Asparagus 里的代码
    println!("I'm growing {plant:?}!");
}
```

```rust
// src/garden.rs
pub mod vegetables; // 声明 vegetables 公用子模块，编译器会在 src/garden/vegetables.rs 中寻找模块代码并包含进来
```

```rust
// src/garden/vegetables.rs
#[derive(Debug)]
pub struct Asparagus {} // 定义一个公用结构体 Asparagus
```

`src/main.rs` 和 `src/lib.rs` 叫做 crate 根。之所以这样叫它们是因为这两个文件的内容都分别在 crate 模块结构的根组成了一个名为 `crate` 的模块，该结构被称为模块树（module tree）。

- 如果一个模块 `A` 被包含在模块 `B` 中，我们将模块 `A` 称为模块 `B` 的子（child）模块，模块 `B` 则是模块 `A` 的父（parent）模块。
- 互为兄弟（siblings）的模块定义在同一模块中。
- 整个模块树都植根于名为 `crate` 的隐式模块下。

```rust
// src/lib.rs
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

```
上述代码的模块树如下所示：
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

### 路径与私有性

为了向 Rust 指示在模块树中从何处查找某个项，我们使用路径。路径有两种形式：

- 绝对路径（absolute path）是以 crate 根（root）开头的完整路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于当前 crate 的代码，则以字面值 `crate` 开头。
- 相对路径（relative path）从当前模块开始，以 `self`、`super` 或当前模块中的某个标识符开头。
- - 通过在路径的开头使用 `super`，从父模块开始构建相对路径

路径都使用双冒号 `::` 来分隔各部分。

在 Rust 中，所有项（函数、方法、结构体、枚举、模块和常量）默认对父模块都是私有的。如果希望创建一个如函数或结构体的私有项，可以将其放入一个模块。

父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用它们父模块中的项。

```rust
// src/lib.rs
mod front_of_house { // 定义一个模块 front_of_house，它与 eat_at_restaurant 同级
                     // 但是其子模块 hosting 是私有的
    mod hosting {
        fn add_to_waitlist() {}
    }
} // 虽然 front_of_house 模块并非公用的，但 eat_at_restaurant 函数可以访问它
  // 因为它们在同一个模块中（crate 根模块）

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist(); // 这里会报错，因为 hosting 是私有的

    // 相对路径
    front_of_house::hosting::add_to_waitlist(); // 这里也会报错
}
```

使模块公有并不能使其内容也是公有的。模块上的 `pub` 关键字只允许其父模块引用它，而不允许访问内部代码，因为模块是一个容器。

```rust
// 修改 src/lib.rs
mod front_of_house {
    pub mod hosting { // 使用 pub 关键字将 hosting 模块声明为公用
                      // 这样 eat_at_restaurant 函数就可以访问 hosting 模块了
                      // 但是 hosting 模块中的 add_to_waitlist 函数仍然是私有的
        fn add_to_waitlist() {}
    }
}
pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist(); // 依旧会报错，因为 add_to_waitlist 是私有的

    // 相对路径
    front_of_house::hosting::add_to_waitlist(); // 这里也依旧会报错
}
```

```rust
// 再次修改 src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {} // 使用 pub 关键字将 add_to_waitlist 函数声明为公用
    }
}
pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist(); // 编译成功

    // 相对路径
    front_of_house::hosting::add_to_waitlist(); // 这里也编译成功
}
```

可以使用 `pub` 来设计公有的结构体和枚举，不过关于在结构体和枚举上使用 `pub` 还有一些额外的区别：

- 结构体定义时使用 `pub`，这个结构体会变成公有的，但是这个结构体的字段仍然是私有的。我们可以根据情况决定每个字段是否公有（是否使用 `pub` 关键字）。
- 枚举定义时使用 `pub`，这个枚举和其所有的变体都会变成公有的。

### use 关键字

可以使用 `use` 关键字创建一个捷径，这样就不用每次都写出完整但冗长的路径了。注意通过 `use` 引入作用域的路径会检查私有性。

```rust
// src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting; // 使用 use 创建一个快捷方式
                                    // 这样在作用域内就可以直接用 hosting 了

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist(); // 这里直接使用 hosting 的 add_to_waitlist 函数
                                // 而不需要写成 crate::front_of_house::hosting::add_to_waitlist()
}
```

`use` 只能创建在其所在的特定作用域内的捷径。将某个名称导入当前作用域后，该名称对此作用域之外还是私有的。

```rust
// src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting; // 使用 use 创建一个快捷方式
                                    // 它只作用在当前作用域内

mod customer {
    pub fn eat_at_restaurant() {
        hosting::add_to_waitlist(); // 编译错误，这里不在 use 的作用域内，不能直接使用 hosting
                                    // 应该写成完整路径
    }
}
```

一般我们都不会在 `use` 语句中精确到某个项，而是会引入一个模块。因为这清晰表明该项不是在本地定义的，同时使完整路径的重复度最小化。

- 例如上面的例子中使用 `use crate::front_of_house::hosting;`，而不是 `use crate::front_of_house::hosting::add_to_waitlist;`。因为后者会在代码中显示为 `add_to_waitlist()` 而非 `hosting::add_to_waitlist()`，这样就不清楚 `add_to_waitlist` 是在本地定义的还是通过 `use` 引入的。
- 如果别的模块中也有一个 `add_to_waitlist` 函数，那么同时在 `use` 中引入这两个函数就会引起冲突。

```rust
use std::fmt;
use std::io; // 引入两个不同的模块
             // 这两个模块中都有一个 Result 类型

fn function1() -> fmt::Result { // 使用 fmt 模块中的 Result 类型
    // ...
}

fn function2() -> io::Result<()> { // 使用 io 模块中的 Result 类型
    // ...
}
// 如果都写成 use std::fmt::Result; 和 use std::io::Result;
// 那么这两个 Result 类型同名会引起冲突
```

可以为 `use` 语句中的模块指定一个名称，使用 `as` 关键字来重命名。

```rust
use std::fmt::Result;
use std::io::Result as IoResult; // 使用 as 关键字为 io 模块中的 Result 类型指定别名 IoResult

fn function1() -> Result {
    // ...
}

fn function2() -> IoResult<()> { // 通过更名来避免冲突
    // ...
}
```

由于 `use` 只能创建在其所在的特定作用域内的捷径，为了让作用域之外的代码能够像在当前作用域中一样使用该名称，可以使用 `pub use`。这种技术被称为重导出（re-exporting）。

```rust
// src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting; // 使用 pub use 重导出 hosting 模块
                                        // 这样当前作用域之外也可以使用 hosting

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist(); // 使用了重导出的 hosting 模块
}
```

### 使用外部包

为了在项目中使用外部包，在 `Cargo.toml` 中加入如下行：

```toml
包名 = "版本号"
```

这行告诉 Cargo 要从 crates.io 下载某外部包和其依赖，并使其可在项目代码中使用。为了能够具体使用，通过 `use` 将其中定义的项或模块引入项目包的作用域中。

```rust
use 外部包名::...::项名
```

`std` 标准库对于你的包来说也是外部 crate，但无需修改 `Cargo.toml`，直接在项目中引入所需的 `std` 中的具体项或模块即可。

```rust
use std::collections::HashMap;
```

如果需要用 use 引入很多项或模块，会占据较大篇幅。可以提取出相同的路径前缀，然后其余部分放在花括号里以逗号分隔。这种嵌套路径能使代码整洁简短。

```rust
use std::{cmp::Ordering, io};
// 等价于：
// use std::cmp::Ordering;
// use std::io;
```

可以在嵌套路径中使用 `self`，表示路径“到此为止”。

```rust
use std::cmp::{self, Ordering};
// 等价于：
// use std::cmp;
// use std::cmp::Ordering;
```

如果希望将一个路径下所有公有项引入作用域，可以在指定路径后跟 glob 运算符 `*`。

```rust
use std::collections::*;
```

## 常见集合

### 使用 Vec 储存列表

`Vec<T>`，即vector，允许我们在一个单独的数据结构中储存多于一个的值，它在内存中彼此相邻地排列所有的值。vector 只能储存相同类型的值。

- 新建一个空 vector 调用 `Vec::new` 函数。这里需要显式注明 `T` 类型。

```rust
let v: Vec<i32> = Vec::new(); // 注明 Vec<T> 存储 i32 元素
```

- 用初始值来创建 vector 时，Rust 提供了 `vec!` 宏后跟方括号的方式。编译器会根据初始值推断类型。

```rust
let v = vec![1, 2, 3];
```

- 更新 vector 时，先确保使用了 `mut` 关键字使其可变。
- - 使用 `push` 方法向 vector 增加新元素。

```rust
let mut v = vec![1, 2, 3];
v.push(4);
```

- 读取 vector 元素可以通过索引或使用 `get` 方法。
- - 使用 `&v[index]` 获取对应索引的元素的引用。若索引值超出现有元素范围，程序会 panic。
- - 当使用索引作为参数调用 `get` 方法时，会得到一个可以用于 `match` 的 `Option<&T>`。若索引值超出现有元素范围，会返回 `None`。

```rust
let third: &i32 = &v[2];
    println!("The third element is {third}");

let third: Option<&i32> = v.get(2);
match third {
    Some(third) => println!("The third element is {third}"),
    None => println!("There is no third element."),
}
```

由于存在不能在相同作用域中同时存在可变和不可变引用的规则，因此创建了元素的引用后再向 vector 中增加元素会报错。因为 vector 中元素在内存相邻排列，剩余空间不足时可能会整体分配到新的内存中，这会导致原先的引用指向被释放的内存。

```rust
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0];

v.push(6); // 编译错误

println!("The first element is: {first}");
```

- 遍历 vector 元素时，可以使用 `for` 循环。
- - 使用 `for ... in &v` 的结构，获取每个元素的引用并访问元素值。

```rust
let v = vec![100, 32, 57];
for i in &v {
    println!("{i}");
}
```

- - 使用 `for ... in &mut v` 的结构，获取每个元素的可变引用并对元素值进行操作。为了修改可变引用所指向的值，必须使用解引用运算符（`*`）获取元素值。

```rust
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50; // 使用 * 运算符获取值，并修改
}
```

- 删除元素时，使用 `pop` 方法会移除并返回 vector 的最后一个元素。
- vector 在其离开作用域时会被释放，此时所有其内容也会被丢弃。借用检查器会确保任何 vector 中内容的引用仅在 vector 本身有效时才可用。

由于 vector 只能储存相同类型的值，为了使其能储存一系列不同类型的值，可以使用枚举实例作为元素。

```rust
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String), // 枚举中使用不同类型
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12), // vector 中采用枚举类型的元素
                                   // 这样能够存放不同类型数据
];
```
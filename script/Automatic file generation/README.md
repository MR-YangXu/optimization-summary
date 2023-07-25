## 自动化生成目录以及根据模板生成 tsx和module.less 文件

### 1. 使用

a. 直接命令行生成

使用命令行：

```sh
# 我们会先判断login/login目录是否存在，如果不存在则会生成
# 然后我们会根据login/login 后续的参数生成对应我们需要的模板文件

node set login/login login set demo
```

b. 通过set.js 文件中的arrs数组中输入我们需要生成的文件名称

使用命令行：

```sh
node set login/login
```

c. 通过set.js 文件中的arrs数组中输入我们需要生成的文件名称，catalogue输入我们需要生成文件的目录 例：login/login

使用命令行：

```sh
node set
```
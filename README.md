# Asm

### Documentation
---
  * <span style='color:red' >`nop`: Blank memory slot</span>
      * usage → `nop`

  * `jmp`: Unconditional jump. Receives one variable as parameter
      * usage → `jmp myvar`

  * `jz`: Jump if the value of the accumulator is 0
    * usage → `jz myvar`

  * `jnz`: Jump if the value of the accumulator is NOT 0
    * usage → `jnz myvar`

  * `lv`: Load a constant directly to the accumulator
    * usage → `lv 0x0007`

  * `add`: Add a constant to the value of the accumulator
    * usage → `add 0x0007`

  * `addm`: Add a variable to the value of the accumulator
    * usage → `addm myvar`

  * `sub`: Subtract a constant to the value of the accumulator
    * usage → `sub 0x0007`

  * `subm`: Add a variable to the value of the accumulator
    * usage → `subm myvar`

  * `mul`: Multiply a constant to the value of the accumulator
    * usage → `mul 0x0007`

  * `mulm`: Multiply a variable to the value of the accumulator
    * usage → `mulm myvar`

  * `div`: Divide a constant to the value of the accumulator
    * usage → `div 0x0007`

  * `divm`: Divide the value of the accumulator by a variable
    * usage → `divm myvar`

  * `load`: Load a variable directly to the accumulator
    * usage → `load myvar`

  * `stor`: Stor the current value of the accumulator to a variable
    * usage → `stor myvar`

  * `sc`: Function call
      * usage → `sc myfunc`

  * `rc`: Function retun, will jump to the line below the function call keeping the current value in the accumulator
      * usage → `rc`

  * `end`: Will stop the execution of the program
    * usage → `end`

  * `in`: Prompts the user with an input (inputed number should be in hexadecimal) and loads the input to the accumulator
      * usage → `in`

  * `out`: Alerts the user with the current value of the accumulator 

### Variable and Function declarations
---
###### Variable
Use variable naturaly throughout the code and declare them at the end of the program followed by a `:` token.

```
lv 0x0F03
stor myvar
end

myvar:
```

###### Function
Call functions from any where in your code and for best practices declar functions at the end of the program along with the variables. At the end of each function the program will return to the line below the function call. Functions are declared by adding a `:` token after the name and followed by a block, to declare the end of a function use the `rc` token.

```
lv 0x0006
sc myfunc
end

myfunc:
div 0x0002
rc
```

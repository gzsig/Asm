# Asm

try the full demo at: [ASM](https://gzsig.io/vm-24bits/)

## The MAN (manual)

#### This guide is designed to help you immediately be productive with ASM, and understand how all of the pieces fit together.

---
### Terminal
* MyTerm saves your history so with the up and down key it navigates through recent commands.
* MyTerm has autocomplete, on tab if there is a command that starts with the letters that have been typed it will autocomplte

###### Terminal Commands

`compile()` Will compile the program present in the editor and throw errors if there are any. 

`execute()` Will execute the program without stopping until the is an `end` token

`help()` Will show available cammands

`step()` Will execute the next line of the program

---
### Asm Commands
  * `nop`: Blank memory slot
      * usage → `nop`

  * `jmp`: Unconditional jump. Receives one variable as parameter and will execute the code starting from  line below.
      * usage → 
      ```js
      jmp myvar
      // skips this code
      lv 0x0004
      myvar:
      //your code that will be executed
      ```

  * `jz`: Jump if the value of the accumulator (AC) is 0. Receives one variable as parameter and will execute the code starting from  line below if the value of the AC is zero. If the value of the AC is NOT zero the next line will be executed.
    * usage → 
    ```js
    jz myvar
    // skips this code (if ac is 0)
    lv 0x0004
    myvar:
    //your code that will be executed
    ```

  * `jnz`: Jump if the value of the accumulator (AC) is NOT 0. Receives one variable as parameter and will execute the code starting from  line below if the value of the AC isn't zero. If the value of the AC is zero the next line will be executed.
    * usage → 
    ```js
    jz myvar
    // skips this code (if AC is not 0)
     lv 0x0004
     myvar:
     //your code that will be executed
     ```

  * `lv`: Load a constant directly to the accumulator. Receives one constant in hexadecimal notation `0x00F2` for example
    * usage → `lv 0x00F2`

  * `add`: Add a constant to the value of the accumulator. Receives one constant in hexadecimal notation `0x00FA` for example
    * usage → `add 0x00FA`

  * `addm`: Receives one variable as parameter and Adds the value of the variable to the value of the accumulator. 
    * usage → 
    ```js
    lv 0x0003
    addm myvar
    // some code 
    myvar: 0x0F3B
    ```

  * `sub`: Subtract a constant from the value of the accumulator. Receives one constant in hexadecimal notation `0x00FA` for example
    * usage → `sub 0x00FA`

  * `subm`: Receives one variable as parameter and Subtracts the value of the variable from the value of the accumulator. 
    * usage → 
    ```js
    lv 0x0003
    subm myvar
    // some code 
    myvar: 0x0F3B
    ```

  * `mul`: Multiply a constant from the value of the accumulator. Receives one constant in hexadecimal notation `0x00FA` for example
    * usage → `mul 0x00FA`

  * `mulm`: Receives one variable as parameter and Multiplies the value of the variable with the value of the accumulator. 
    * usage → 
    ```js
    lv 0x0003
    mulm myvar
    // some code 
    myvar: 0x0F3B
    ```

  * `div`: Divides the value of the accumulator by a constant. Receives one constant in hexadecimal notation as parameter, `0x00FA` for example
    * usage → `mul 0x00FA`

  * `divm`: Receives one variable as parameter and Divides the value of the accumulator by value of the variable. 
    * usage → 
    ```js
    lv 0x0003
    divm myvar
    // some code 
    myvar: 0x0F3B
    ```

  * `load`: Receives one variable as parameter and loads the value of the variable to the accumulator
    * usage → 
    ```js
    load myvar // the value 00A2 will be loaded to the AC
    // some code
    myvar: 0x00A2
    ```

  * `stor`: Stor the current value of the accumulator to a variable
    * usage → 
    ```js
    lv 0x00E2
    stor myvar
    // some code
    myvar: //will receive the value 00E2
    ```
  * `sc`: Function call
      * usage → `sc myfunc`

  * `rc`: Function retun, will jump to the line below the function call keeping the current value in the accumulator
      * usage → `rc`

  * `end`: Will stop the execution of the program
    * usage → `end`

  * `in`: Prompts the user with an input (inputed number should be in hexadecimal) and loads the input to the accumulator
      * usage → `in`

  * `out`: Alerts the user with the current value of the accumulator 


---
### Variable
Use variable naturaly throughout the code and declare them at the end of the program followed by a `:` token.

```js
lv 0x0F03
stor myvar
end

myvar:
```
Later in the program if you `load myvar` the value `0x0F03` will be loaded to the accumulator

---
### Function
Call functions from any where in your code and for best practices declar functions at the end of the program along with the variables. At the end of each function the program will return to the line below the function call. Functions are declared by adding a `:` token after the name and followed by a block. To declare the end of a function use the `rc` token.

```js
lv 0x0006
sc myfunc
out //myfunc will jump back here
end

myfunc:
div 0x0002
rc
```

---
### Comment
To comment any line use the `//` tokens and any following comand will be commented
```js
//I am a comment

in
stor mynum
div 0x0002 //divide the value of the accumulator by 2
mul 0x0002
stor res
load mynum
subm res
jz par //If the value is not zero jump :)
lv 0x000
end

par: //I'm a function
lv 0x0001
end


mynum:
res:
```

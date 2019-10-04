# Asm

### Documentation
---
  * `nop`: Blank memory slot
      * ex => `nop`

  * `jmp`: Unconditional jump. Receives one variable as parameter
      * ex => `jmp myvar`

  * `jz`: Jump if the value of the accumulator is 0
    * ex => `jz myvar`

  * `jnz`: Jump if the value of the accumulator is NOT 0
    * ex => `jnz myvar`

  * `lv`: Load a constant directly to the accumulator
    * ex => `lv 0x0007`

  * `add`: Add a constant to the value of the accumulator
    * ex => `add 0x0007`

  * `addm`: Add a variable to the value of the accumulator
    * ex => `addm myvar`

  * `sub`: Subtract a constant to the value of the accumulator
    * ex => `sub 0x0007`

  * `subm`: Add a variable to the value of the accumulator
    * ex => `subm myvar`

  * `mul`: Multiply a constant to the value of the accumulator
    * ex => `mul 0x0007`

  * `mulm`: Multiply a variable to the value of the accumulator
    * ex => `mulm myvar`

  * `div`: Divide a constant to the value of the accumulator
    * ex => `div 0x0007`

  * `divm`: Divide the value of the accumulator by a variable
    * ex => `divm myvar`

  * `load`: Load a variable directly to the accumulator
    * ex => `load myvar`

  * `stor`: Stor the current value of the accumulator to a variable
    * ex => `stor myvar`

  * `sc`: Function call
      * ex => `sc myfunc`

  * `rc`: Function retun, will jump to the line below the function call keeping the current value in the accumulator
      * ex => `rc`

  * `end`: Will stop the execution of the program
    * ex => `end`

  * `in`: Prompts the user with an input (inputed number should be in hexadecimal) and loads the input to the accumulator
      * ex => `in`

  * `out`: Alerts the user with the current value of the accumulator 


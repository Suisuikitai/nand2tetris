// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
//@8192
//D=A
//colorが白の時は0,黒の時は1
(LOOP)
  @KBD
  D=M

  @BLACK
  D;JGT
  @WHITE
  0;JMP

  (BLACK)
    @color
    M=-1
    @CHOOSE
    0;JMP
  (WHITE)
    @color
    M=0

  (CHOOSE)
    @color
    D=M
    @SCREEN
    D=D-M
    @LOOP
    D;JEQ

(PAINT)
  @SCREEN
  D=A
  @address
  M=D
  @count
  M=0
  //これを8192回繰り返す
  (PAINT_LOOP)
  @color
  D=M
  @address
  A=M
  M=D
  D=A+1
  @address
  M=D
  @count
  MD=M+1
  @8191
  D=A-D
  @LOOP
  D;JEQ
  @PAINT_LOOP
  0;JMP
@256
D=A
@SP
M=D
//Start callFunc Sys.init
@Sys.init_0
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@0
D=D+A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(Sys.init_0)
//Fin callFunc Sys.init
//Start writeFunction (Sys.init)
(Sys.init)
@SP
A=M
//writeFunction Fin(Sys.init)
@4
D=A
@SP
A=M
M=D
@SP
M=M+1
//Start callFunc Main.fibonacci
@Main.fibonacci_1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@1
D=D+A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci_1)
//Fin callFunc Main.fibonacci
(WHILE)
@WHILE
0;JMP
//Start writeFunction (Main.fibonacci)
(Main.fibonacci)
@SP
A=M
//writeFunction Fin(Main.fibonacci)
@ARG
A=M
D=M
@SP
A=M
M=D
@SP
M=M+1
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
@SP
M=M-1
A=M
D=M
@SP
A=M-1
D=M-D
@J_true0
D;JLT
@J_false0
0;JMP
(J_true0) //trueのジャンプ用のラベル
@SP
A=M-1
M=-1
@END0
0;JMP
(J_false0)
@SP
A=M-1
M=0
(END0)
@SP
M=M-1
A=M
D=M
@IF_TRUE
D;JLT
D;JGT
@IF_FALSE
0;JMP
(IF_TRUE)
@ARG
A=M
D=M
@SP
A=M
M=D
@SP
M=M+1
//writeReturn
@LCL
D=M
@R13
M=D
@5
A=D-A
D=M
@R14
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@R13
A=M-1
D=M
@THAT
M=D
@R13
A=M-1
A=A-1
D=M
@THIS
M=D
@R13
D=M
@3
A=D-A
D=M
@ARG
M=D
@R13
D=M
@4
A=D-A
D=M
@LCL
M=D
@R14
A=M
0;JMP
//Fin writeReturn
(IF_FALSE)
@ARG
A=M
D=M
@SP
A=M
M=D
@SP
M=M+1
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
@SP
M=M-1
A=M
D=M
@SP
A=M-1
D=M-D
@SP
A=M-1
M=D
//Start callFunc Main.fibonacci
@Main.fibonacci_2
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@1
D=D+A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci_2)
//Fin callFunc Main.fibonacci
@ARG
A=M
D=M
@SP
A=M
M=D
@SP
M=M+1
@1
D=A
@SP
A=M
M=D
@SP
M=M+1
@SP
M=M-1
A=M
D=M
@SP
A=M-1
D=M-D
@SP
A=M-1
M=D
//Start callFunc Main.fibonacci
@Main.fibonacci_3
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@1
D=D+A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci_3)
//Fin callFunc Main.fibonacci
@SP
M=M-1
A=M
D=M
@SP
A=M-1
D=D+M
@SP
A=M-1
M=D
//writeReturn
@LCL
D=M
@R13
M=D
@5
A=D-A
D=M
@R14
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@R13
A=M-1
D=M
@THAT
M=D
@R13
A=M-1
A=A-1
D=M
@THIS
M=D
@R13
D=M
@3
A=D-A
D=M
@ARG
M=D
@R13
D=M
@4
A=D-A
D=M
@LCL
M=D
@R14
A=M
0;JMP
//Fin writeReturn

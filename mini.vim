  set nocompatible
  set runtimepath^=~/.config/nvim/plugged/coc.nvim
  filetype plugin indent on
  syntax on
  set hidden

  " Highlight symbol under cursor on CursorHold
  autocmd CursorHold * silent :call CocActionAsync('doHover')
  set updatetime=300

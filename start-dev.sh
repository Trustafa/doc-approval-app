#!/bin/zsh

SESSION="spi-doc-approval-dev"
SCRIPT_DIR="${0:A:h}"

# Kill existing session if needed
tmux has-session -t $SESSION 2>/dev/null && tmux kill-session -t $SESSION

# Start new session in current directory, first pane runs server1
tmux new-session -d -s $SESSION -c $SCRIPT_DIR 'npm run dev'

# Focus first pane and attach
tmux select-pane -t 0
tmux attach -t $SESSION

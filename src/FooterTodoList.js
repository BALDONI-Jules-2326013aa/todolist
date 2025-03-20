import AddTodoItemButton from "./AddTodoItemButton";

function FooterTodoList({ onAddTodo }) {
    return (
        <footer className="footer-todo-list">
            <AddTodoItemButton onClick={onAddTodo} />
        </footer>
    );
}

export default FooterTodoList;

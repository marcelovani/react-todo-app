import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Menu, MenuItem, View, Divider } from '@aws-amplify/ui-react';
import { Loader, useTheme } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const { tokens } = useTheme();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  const { signOut } = useAuthenticator();

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
      <main>
      <View width="4rem">
        <Menu>
          <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
        </Menu>
      </View>

      <h1>My todos</h1>

      <button onClick={createTodo}>+ new</button>
      <ul>
        {
          todos.length === 0
            ? <Loader
              variation="linear"
              emptyColor={tokens.colors.black}
              filledColor={tokens.colors.orange[40]}
            />
            : todos.map((todo) => (
              <li key={todo.id}>{todo.content}<div id="delete" onClick={() => deleteTodo(todo.id)}>x</div></li>
            ))
        }
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;

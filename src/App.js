import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createTask } from './graphql/mutations';
import { listTasks } from './graphql/queries';
import { Button, Card, Icon, TextAreaField, TextField, withAuthenticator } from '@aws-amplify/ui-react';

function App({ signOut, user }) {

  const [ task, setTask ] = useState({
    name: '',
    description: '',
  });

  const [ tasks, setTasks ] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.graphql(graphqlOperation(createTask, { input: task }));
  };

  useEffect(() => {
    async function loadTasks() {
      const result = await API.graphql(graphqlOperation(listTasks));
      setTasks(result.data.listTasks.items);
    }

    loadTasks();
  }, []);

  return (
    <div className="container">
      <Button onClick={ signOut }>Sign out</Button>
      <div className="row">
        <h1 className="d-flex justify-content-center">Hello { user.attributes.email }</h1>
        <div className="col-md-4 offset-md-4">
          <div style={ styles.container }>
            <form onSubmit={ handleSubmit }>
              <TextField label="Task name" name="name"
                         onChange={ e => setTask({ ...task, name: e.target.value }) }/>
              <TextAreaField name="description"
                             onChange={ e => setTask({ ...task, description: e.target.value }) }
                             label="Description"></TextAreaField>
              <Button type="submit" gap="0.1rem" size="small">
                <IconSave/> Save
              </Button>
            </form>
            <div className="mt-5">
              { tasks.map(task => {
                if (!task) return <h1>No tasks to display</h1>;
                return <Card variation="outlined">
                  <h3>{ task.name }</h3>
                  <p>{ task.description }</p>
                </Card>;
              }) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const IconSave = () => {
  return (
    <Icon
      ariaLabel=""
      pathData="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z"
    />
  );
};

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' },
};

export default withAuthenticator(App);

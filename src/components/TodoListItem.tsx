import React, {ChangeEvent, useState} from 'react';
import {Link} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from '@asset/App.module.css'
import {Todo} from '@root/types'

interface TodoListItemProps {
  todo: Todo;
  onRemoveTodo: (todo: Todo) => void;
  onHandleEdit: (todo: Todo) => void;
}

export default function TodoListItem({todo, onRemoveTodo, onHandleEdit}: TodoListItemProps) {

    const [editValue, setEditValue] = useState("")
    const [show, setShow] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value)
    }

    const handleShowEdit = (todo: Todo) => {
        setShow(true)
    }

    const handleSaveEdit = (id: number | undefined) => {
      if (id !== undefined )  {
        onHandleEdit({
          id,
          title: editValue,
      })
      setShow(false)
    }
    }


    return (
        <>
        <div className={styles.lists}>
            <div className={styles.list}> 
            <Link className={styles.link} to={'/' + todo.id}>
                <span className={styles.title} >{todo.title} </span>
            </Link>
            <div className={styles.wrapButton}>
            <button
             className={styles.button}
             type="button"
             onClick={() => 
              onRemoveTodo(todo)
            }
            >Remove
            </button>
            <button
             className={styles.button}
             type="button"
             onClick={() => handleShowEdit(todo)}
             
             >Edit
            </button>
            </div>
            </div>
            

      <Modal show={show} onHide={()=> setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control 
              as="textarea" 
              rows={3}
              onChange={handleChange} 
              placeholder={todo.title}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
          className={styles.button}
           onClick={() => handleSaveEdit(todo.id)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
        </>
    )
}


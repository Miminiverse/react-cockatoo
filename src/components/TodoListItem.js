import React, {useState} from 'react';
import styles from '../static/App.module.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types'

export default function TodoListItem({todo, onRemoveTodo, onHandleEdit}) {

    const [editValue, setEditValue] = useState("")
    const [show, setShow] = useState(false);

    const handleChange = (e) => {
        setEditValue(e.target.value)
    }

    const handleShowEdit = (todo) => {
        setShow(true)
    }

    const handleSaveEdit = id => {
        onHandleEdit({
            id,
            title: editValue,
        })
        setShow(false)

    }


    return (
        <>
        <div className={styles.lists}>
            <div className={styles.list}> 
                <span>{todo.title} </span>
            <div>
            <button
             className={styles.buttonRemove}
             type="button"
             onClick={() => 
              onRemoveTodo(todo)
            }
            >Remove
            </button>
            <button
             className={styles.buttonRemove}
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
            className={styles.buttonRemove}

           onClick={() => handleSaveEdit(todo.id)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
        </>
    )
}


TodoListItem.propTypes = {
  todo: PropTypes.object,
  onRemoveTodo: PropTypes.func,
  onHandleEdit: PropTypes.func,
}
import styles from '../static/App.module.css'

const Pagination = ({totalTodos, todoPerPage,setCurrentPage}) => {

    let pages = []

    for (let i = 1; i<= Math.ceil(totalTodos/todoPerPage); i++) {
        pages.push(i)
    }

    return (
        <>
        <div className={styles.pagination}>
        {pages.map((page, idx) => 
        <button              
        className={styles.buttonPagination}
        key={idx}
        onClick={() => setCurrentPage(page)}
        >{page}
        </button>
        )}
        </div>
        </>
    )

}

export default Pagination
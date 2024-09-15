import styles from '@asset/App.module.css'
import React from 'react'

interface PaginationProps {
totalTodos: number;
todoPerPage: number;
setCurrentPage: (page: number) => void;
}

const Pagination = ({totalTodos, todoPerPage,setCurrentPage}: PaginationProps) => {

    let pages: number[] = []

    for (let i = 1; i<= Math.ceil(totalTodos/todoPerPage); i++) {
        pages.push(i)
    }

    return (
        <>
        <div className={styles.pagination}>
        {pages.map((page: number, idx: number) => 
        <button              
        className={styles.button}
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
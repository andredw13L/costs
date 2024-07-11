import { useParams } from 'react-router-dom'
import styles from './Project.module.css'
import { useEffect, useState } from 'react'
import Loading from "../layouts/Loading"
import Container from "../layouts/Container";

function Project() {

    const { id } = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)


    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.json();
            })
            .then((data) => {
                setProject(data)
            })
            .catch((err) => console.log(err));
        }, );
    }, [id]);

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    return (
        <>
         {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button  className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria: </span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento - </span>RS: {project.budget}
                                </p>
                                <p>
                                    <span>Total utilizado - </span>RS: {project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <p>Detalhes do projeto</p>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        ) 

        :(

         <Loading />

        )}
        </>
    )
}

export default Project
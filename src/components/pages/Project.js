import { useParams } from 'react-router-dom'
import styles from './Project.module.css'
import { useEffect, useState } from 'react'
import Loading from "../layouts/Loading"
import Container from "../layouts/Container";
import ProjectForm from '../projects/ProjectForm'
import Message from "../layouts/Message";

function Project() {

    const { id } = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage]  = useState()
    const [typeMessage, setTypeMessage] = useState()


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

    function editPost(project) {
        // Validação do budget
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor do que o custo do projeto!')
            setTypeMessage('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        })
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado!')
            setTypeMessage('success')
        })
        .catch((err) => console.log(err));

    }

    return (
        <>
         {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={typeMessage} msg={message}/>}
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
                                <ProjectForm
                                 handleSubmit={editPost}
                                  btnText="Concluir edição" 
                                  projectData={project}
                                />
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
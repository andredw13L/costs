import { useNavigate } from 'react-router-dom'
import ProjectForm from '../projects/ProjectForm'
import styles from './NewProject.module.css'


function NewProject() {

    // useHistory foi substituído por useNavigate
    const navigate = useNavigate()


    function createPost(project) {

        // Initialize cost and services
        project.cost = 0
        project.services = []

        fetch("http://localhost:5000/projects", { 
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
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
            navigate("/projects", {message: "Projeto criado com sucesso!"})
        })
        .catch((err) => console.log(err))
    }

    return(
        <div className={styles.newProject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie o seu projeto para depois adicionar os serviços</p>
            <ProjectForm btnText="Criar Projeto" handleSubmit={createPost} />
        </div>
    )
}

export default NewProject
import { useParams } from 'react-router-dom'
import { parse, v4 as uuidv4 } from 'uuid'
import styles from './Project.module.css'
import { useEffect, useState } from 'react'
import Loading from "../layouts/Loading"
import Container from "../layouts/Container";
import ProjectForm from '../projects/ProjectForm'
import Message from "../layouts/Message";
import ServiceForm from '../services/ServiceForm';
import ServiceCard from '../services/ServiceCard';

function Project() {

    const { id } = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
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
                    setServices(data.services)
                })
                .catch((err) => console.log(err));
        }, 300);
    }, [id]);


    function createService(project) {

        // Atualizar a mensagem em caso de nova requisição
        setMessage('')

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // Validação se o budget fo excedido
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setTypeMessage('error')
            project.services.pop()
            return false
        }

        // Adicionar o service cost  do projeto para o total cost
        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(project)
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.json()
            })
            .then(data => {
                setShowServiceForm(false)
            })
            .catch((err) => console.log(err))

    }

    function RemoveService(id, cost) {
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project
        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json()
        })
        .then(data => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
        })
        .catch((err) => console.log(err))
        
    }


    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }


    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function editPost(project) {

        // Atualizar a mensagem em caso de nova requisição
        setMessage('')

        // Validação do budget
        if (project.budget < project.cost) {
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
                        {message && <Message type={typeMessage} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria: </span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento: </span>R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total utilizado: </span>R${project.cost}
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
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={RemoveService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>Não há serviços cadastrados</p>}
                        </Container>
                    </Container>
                </div>
            )

                : (

                    <Loading />

                )}
        </>
    )
}

export default Project
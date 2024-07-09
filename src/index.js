//Exercício 1
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors())
app.use(express.json())

const veiculos = []

app.post('/veiculos', (req, res) => {
    const {modelo, marca, ano, cor, preco} = req.body
   
    if(!modelo || !marca || !ano || !cor || !preco) {
        return res.status(400).json({message: 'Informe todos os dados.'})
    }

    const carroNovo = {
        id: uuidv4(),
        modelo,
        marca,
        ano,
        cor,
        preco
    }

    veiculos.push(carroNovo)

    res.status(201).json({message: 'Carro adicionado com sucesso', mostrar: carroNovo})
})

app.get('/veiculos', (req, res) => {
    if (veiculos.length === 0) {
        return res.status(404).json({message: 'Nenhum carro encontrado.'})
    }
    const mostrarCarros = veiculos.map(veiculo => {
        return {id: veiculo.id, modelo: veiculo.modelo, marca: veiculo.marca, ano: veiculo.ano, cor: veiculo.cor, preco: veiculo.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    })

    res.status(200).json(mostrarCarros)
})

app.get('/veiculos', (req, res) => {
    const {marca} = req.query

    if (!marca) {
        return res.status(400).json({ message: 'Informe a marca do carro.' })
    }
    const carrosFiltrados = veiculos.filter(veiculo => veiculo.marca.toLowerCase() === marca.toLowerCase())

    if (carrosFiltrados.length === 0) {
        return res.status(404).json({ message: `Nenhum veículo da marca "${marca}" encontrado` })
    }

    const mostrarCarros = carrosFiltrados.map(veiculo => ({
        modelo: veiculo.modelo, cor: veiculo.cor, preco: veiculo.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}));

    res.status(200).json(mostrarCarros)
})

////////////////////////////////////////////////////////////////////////

//Exercício 2
app.put('/veiculos/:id/1', (req, res) => {
    const{id} = req.params
    const{modelo, cor, preco} = req.body

    const encontrar = veiculos.find(veiculo => veiculo.id === id)

    if(!encontrar) {
        return res.status(404).json({message: 'Carro não encontado'})
    }

     if(modelo) {
        encontrar.modelo = modelo
     }

     if(cor) {
        encontrar.cor = cor
     }

     if(preco) {
        encontrar.preco = preco
     }

    const mostrarCarros = veiculos.map(veiculo => {
        return { id: veiculo.id, modelo: veiculo.modelo, marca: veiculo.marca, ano: veiculo.ano, cor: veiculo.cor, preco: veiculo.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    });
    veiculos.push(modelo, cor, preco)

    res.status(200).json({message: 'Carro atualizado com sucesso.'})
})

app.delete('/veiculos/:id', (req, res) => {
    const {id} = req.params

    const index = veiculos.findIndex(veiculo => veiculo.id === id)

    if (index === -1) {
        return res.status(404).json({ message: 'Veículo não encontrado. Favor retornar ao menu inicial.' })
    }

    veiculos.splice(index, 1)

    res.status(200).json({ message: 'Veículo removido com sucesso.' })
})

const usuarios = []

app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Informe todos os dados: nome, email e senha.' })
    }

    try {
    
        const senhaCriada = await bcrypt.hash(senha, 10)

        const novoUsuario = {
            nome,
            email,
            senha: senhaCriada
        }
        usuarios.push(novoUsuario)

        res.status(201).json({ message: 'Usuário criado com sucesso.' })
    } catch (error) {

        console.error('Erro ao criar usuário:', error)
        res.status(500).json({ message: 'Erro ao criar usuário. Tente novamente mais tarde.' })
    }
})

app.post('/login', async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ message: 'Informe o email e a senha.' })
    }

    const usuario = usuarios.find(user => user.email === email)
    if (!usuario) {

        return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    try {
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if (senhaCorreta) {
            return res.status(200).json({ message: 'Login realizado com sucesso.' })

        } else {
            return res.status(401).json({ message: 'Senha incorreta.' })
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error)

        res.status(500).json({ message: 'Erro ao fazer login. Tente novamente mais tarde.' })
    }
})

app.listen(3333, () => {
    console.log('O servidor estar na porta 3333')
})
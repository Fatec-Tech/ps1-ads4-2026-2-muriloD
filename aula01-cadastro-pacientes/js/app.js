// Array que guarda os pacientes
const pacientes = [];

// Referências aos elementos do DOM
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const totalPacientes = document.getElementById('total-pacientes');
const busca = document.getElementById('busca');
const ordenarNome = document.getElementById('ordenar-nome');

// Carrega os pacientes salvos no localStorage
const pacientesSalvos = localStorage.getItem('pacientes');

if (pacientesSalvos) {
	const dados = JSON.parse(pacientesSalvos);

	dados.forEach((paciente) => {
		pacientes.push(paciente);
	});
}

// Adiciona um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone) {

	const novoPaciente = {
		nome,
		email,
		nascimento,
		telefone
	};

	pacientes.push(novoPaciente);

	salvarPacientes();
}

// Salva os pacientes no localStorage
function salvarPacientes() {

	localStorage.setItem('pacientes', JSON.stringify(pacientes));

}

// Atualiza o contador
function atualizarTotal() {

	totalPacientes.textContent = pacientes.length;

}

// Desenha a tabela
function renderizarTabela(lista = pacientes) {

	tabela.innerHTML = '';

	lista.forEach((paciente) => {

		const linha = document.createElement('tr');

		linha.innerHTML = `
			<td>${paciente.nome}</td>
			<td>${paciente.email}</td>
			<td>${formatarData(paciente.nascimento)}</td>
			<td>${calcularIdade(paciente.nascimento)}</td>
			<td>${paciente.telefone}</td>
			<td>
				<button class="btn btn-danger btn-sm">Remover</button>
			</td>
		`;

		const botaoRemover = linha.querySelector('button');

		botaoRemover.addEventListener('click', () => {

			const indice = pacientes.indexOf(paciente);

			pacientes.splice(indice, 1);

			salvarPacientes();
			renderizarTabela();
			atualizarTotal();

		});

		tabela.appendChild(linha);

	});

}

// Calcula a idade
function calcularIdade(dataISO) {

	const [ano, mes, dia] = dataISO.split('-');

	const hoje = new Date();

	let idade = hoje.getFullYear() - ano;

	if (
		hoje.getMonth() + 1 < mes ||
		(hoje.getMonth() + 1 == mes && hoje.getDate() < dia)
	) {
		idade--;
	}

	return idade;

}

// Formata a data
function formatarData(dataISO) {

	const [ano, mes, dia] = dataISO.split('-');

	return `${dia}/${mes}/${ano}`;

}

// Evento de cadastro
formulario.addEventListener('submit', (event) => {

	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;

	// Verifica se o e-mail já existe
	const emailExiste = pacientes.some((paciente) => {
		return paciente.email === email;
	});

	if (emailExiste) {

		alert('Este e-mail já está cadastrado!');

		return;

	}

	adicionarPaciente(nome, email, nascimento, telefone);

	renderizarTabela();
	atualizarTotal();

	formulario.reset();

});

// Busca em tempo real pelo nome
busca.addEventListener('input', () => {

	const textoBusca = busca.value.toLowerCase();

	const pacientesFiltrados = pacientes.filter((paciente) => {

		return paciente.nome.toLowerCase().includes(textoBusca);

	});

	renderizarTabela(pacientesFiltrados);

});

// Ordenação por nome
ordenarNome.addEventListener('click', () => {

	pacientes.sort((a, b) => {
		return a.nome.localeCompare(b.nome);
	});

	salvarPacientes();
	renderizarTabela();

});

// Mostra os dados salvos ao abrir a página
renderizarTabela();
atualizarTotal();
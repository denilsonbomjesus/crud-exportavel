let dados = JSON.parse(localStorage.getItem("dados")) || [];
const form = document.getElementById("crudForm");
const tabela = document.getElementById("tabelaDados");
const exportarBtn = document.getElementById("exportarBtn");
const importarBtn = document.getElementById("importarBtn");
const importarInput = document.getElementById("importarInput");

function atualizarTabela() {
  tabela.innerHTML = "";
  dados.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.idade}</td>
      <td>
        <button onclick="editar(${index})">Editar</button>
        <button onclick="excluir(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(row);
  });
  localStorage.setItem("dados", JSON.stringify(dados));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  dados.push({ nome, idade });
  form.reset();
  atualizarTabela();
});

function editar(index) {
  const novoNome = prompt("Novo nome:", dados[index].nome);
  const novaIdade = prompt("Nova idade:", dados[index].idade);
  if (novoNome && novaIdade) {
    dados[index] = { nome: novoNome, idade: novaIdade };
    atualizarTabela();
  }
}

function excluir(index) {
  if (confirm("Tem certeza que deseja excluir este item?")) {
    dados.splice(index, 1);
    atualizarTabela();
  }
}

exportarBtn.addEventListener("click", () => {
  const cabecalho = "Nome,Idade\n";
  const linhas = dados.map(item => `${item.nome},${item.idade}`).join("\n");
  const csv = cabecalho + linhas;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modelo.csv";
  a.click();
  URL.revokeObjectURL(url);
});

importarBtn.addEventListener("click", () => importarInput.click());

importarInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const linhas = e.target.result.split("\n").slice(1); // ignora o cabeçalho
    dados = linhas
      .map(l => l.trim())
      .filter(l => l.length)
      .map(l => {
        const [nome, idade] = l.split(",");
        return { nome, idade };
      });
    atualizarTabela();
  };
  reader.readAsText(file);
});

atualizarTabela();

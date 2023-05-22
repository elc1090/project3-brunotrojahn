var form = document.getElementById("form-visita");
var btn = document.querySelector("button.mobile-menu-button");
var menu = document.querySelector(".mobile-menu");
var buttonAddVisita = document.getElementById("button-add-visita");
var buttonVoltar = document.getElementById("button-voltar");

function toggleForm() {
    form.classList.toggle("hidden");
    document.getElementById("div-visitas").classList.toggle("hidden");
}

async function carregarTabelaVisitas() {
    const response = await fetch('http://localhost:3000/api/visita');
    const { data } = await response.json();

    const tbody = document.querySelector('#tabela-visitas tbody');

    tbody.innerHTML = '';

    data.forEach(visita => {
        
        const tr = document.createElement('tr');
        const tdData = document.createElement('td');
        const tdFazenda = document.createElement('td');
        const tdBotao = document.createElement('td');

        tr.setAttribute('data-id', visita.id);
        tdData.classList.add('md:px-6');
        tdFazenda.classList.add('md:px-6');
        tdBotao.classList.add('text-right');
        tdBotao.classList.add('md:pr-6');

        tdData.innerText = visita.visita_data;
        tdFazenda.innerText = visita.nome_fazenda;
        tdBotao.innerHTML = '<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded button-detalhes">Detalhes</button>';

        tr.appendChild(tdData);
        tr.appendChild(tdFazenda);
        tr.appendChild(tdBotao);

        tbody.appendChild(tr);
    });

    const botoesDetalhes = document.querySelectorAll('.button-detalhes');
    botoesDetalhes.forEach(botao => {   
        botao.addEventListener('click', () => {
            let idVisita = botao.parentElement.parentElement.getAttribute('data-id');
            localStorage.setItem('idVisita', idVisita);
            window.location.href = 'visita.html';
        });
    });
}

function carregarFazendas() {
    try {
        fetch('http://localhost:3000/api/fazenda')
            .then(response => response.json())
            .then(({ data }) => {
                const select = document.querySelector('#fazenda');

                data.forEach(fazenda => {
                    const option = document.createElement('option');
                    option.value = fazenda.id;
                    option.innerText = fazenda.nome;
                    select.appendChild(option);
                });
            });
    } catch (error) {
        console.log(error);
    }
}

btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dataVisita = document.getElementById('data').value;
    const fazenda = document.getElementById('fazenda').value;

    let dataVisitaSql = dataVisita.split('/').reverse().join('-');

    const data = {
        data: dataVisitaSql,
        fazenda_id: fazenda
    };

    try {
        const response = await fetch('http://localhost:3000/api/visita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Visita cadastrada com sucesso!');
            setTimeout(() => {
                window.location.href = 'visitas.html';
            }, 1000);
        } else {
            console.log('Erro ao cadastrar visita:', response.statusText);
        }
    } catch (error) {
        console.log('Erro ao cadastrar visita:', error.message);
    }
});

buttonAddVisita.addEventListener("click", () => {
    toggleForm();
});

buttonVoltar.addEventListener("click", () => {
    window.scrollTo(0, 0);
    toggleForm();
});

carregarTabelaVisitas();
carregarFazendas();
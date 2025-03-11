//AGENDAMENTOS
$(document).ready(function () {
    let agendamentos = [];
    let agendamentoSelecionado = null;

    function atualizarTabela() {
        let tabela = $("#tabelaAgendamentos");
        tabela.empty();
        agendamentos.forEach((agendamento, index) => {
            tabela.append(`
                <tr onclick="selecionarLinha(this, ${index})">
                    <td>${index + 1}</td>
                    <td>${agendamento.aula}</td>
                    <td>${formatarData(agendamento.inicio)}</td>
                    <td>${formatarData(agendamento.fim)}</td>
                    <td>${agendamento.status}</td>
                </tr>
            `);
        });

        $("#btnEditar, #btnRemover").prop("disabled", true);
    }

    function formatarData(data) {
        let d = new Date(data);
        return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    }

    window.selecionarLinha = function (linha, id) {
        $("#tabelaAgendamentos tr").removeClass("table-active");
        $(linha).addClass("table-active");
        agendamentoSelecionado = id;
        $("#btnEditar, #btnRemover").prop("disabled", false);
    };

    $("#formCadastro").submit(function (event) {
        event.preventDefault();
        let novoAgendamento = {
            aula: $("#aulaCadastro").val(),
            inicio: $("#inicioCadastro").val(),
            fim: $("#fimCadastro").val(),
            obs: $("#obsCadastro").val(),
            status: $("#statusCadastro").val()
        };
        agendamentos.push(novoAgendamento);
        atualizarTabela();
        $("#modalCadastro").modal("hide");
        $("#formCadastro")[0].reset();
    });

    $("#btnEditar").click(function () {
        if (agendamentoSelecionado !== null) {
            let agendamento = agendamentos[agendamentoSelecionado];
            $("#idEdicao").val(agendamentoSelecionado);
            $("#aulaEdicao").val(agendamento.aula);
            $("#inicioEdicao").val(agendamento.inicio);
            $("#fimEdicao").val(agendamento.fim);
            $("#obsEdicao").val(agendamento.obs);
            $("#statusEdicao").val(agendamento.status);
        }
    });

    $("#formEdicao").submit(function (event) {
        event.preventDefault();
        let id = parseInt($("#idEdicao").val());
        if (!isNaN(id)) {
            agendamentos[id] = {
                aula: $("#aulaEdicao").val(),
                inicio: $("#inicioEdicao").val(),
                fim: $("#fimEdicao").val(),
                obs: $("#obsEdicao").val(),
                status: $("#statusEdicao").val()
            };
            atualizarTabela();
            $("#modalEdicao").modal("hide");
        }
    });

    $("#btnRemover").click(function () {
        if (agendamentoSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este agendamento?")) {
                agendamentos.splice(agendamentoSelecionado, 1);
                atualizarTabela();
                agendamentoSelecionado = null;
                $("#btnEditar, #btnRemover").prop("disabled", true);
            }
        }
    });

    atualizarTabela();

    function formatarDuracao(input) {
        let valor = input.value.replace(/\D/g, "");
        if (valor.length > 6) valor = valor.substring(0, 6);

        let formatado = "";
        if (valor.length > 0) formatado = valor.substring(0, 2);
        if (valor.length > 2) formatado += ":" + valor.substring(2, 4);
        if (valor.length > 4) formatado += ":" + valor.substring(4, 6);

        input.value = formatado;
    }

    $("#duracaoCadastroAulas, #duracaoEdicaoAulas").on("input", function () {
        formatarDuracao(this);
    });

    function validarDuracao(valor) {
        return /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(valor);
    }

    $("#formCadastroAulas, #formEdicaoAulas").submit(function (event) {
        let duracaoCampo = $(this).find("input[id^='duracao']");

        if (!validarDuracao(duracaoCampo.val())) {
            alert("Formato de duração inválido! Use o formato HH:MM:SS.");
            event.preventDefault();
            return false;
        }

        return true;
    });

    //AULAS
    let aulas = [];
    let aulaSelecionada = null;

    function atualizarTabelaAulas() {
        let tabela = $("#tabelaAulas");
        tabela.empty();
        aulas.forEach((aula, index) => {
            tabela.append(`
                    <tr onclick="selecionarLinhaAulas(this, ${index})">
                        <td>${index + 1}</td>
                        <td>${aula.nome}</td>
                        <td>${aula.descricao}</td>
                        <td>${aula.duracao}</td>
                        <td>${aula.instrutor}</td>
                    </tr>
                `);
        });

        $("#btnEditarAula, #btnRemoverAula").prop("disabled", true);
    }

    window.selecionarLinhaAulas = function (linha, id) {
        $("#tabelaAulas tr").removeClass("table-active");
        $(linha).addClass("table-active");
        aulaSelecionada = id;
        $("#btnEditarAula, #btnRemoverAula").prop("disabled", false);
    };

    $("#formCadastroAulas").submit(function (event) {
        event.preventDefault();

        let duracao = $("#duracaoCadastroAulas").val().trim();

        if (!validarDuracao(duracao)) {
            return;
        }

        let novaAula = {
            nome: $("#nomeCadastroAulas").val().trim(),
            descricao: $("#descricaoCadastroAulas").val().trim(),
            duracao: duracao,
            instrutor: $("#instrutorCadastroAulas").val().trim()
        };

        if (!novaAula.nome || !novaAula.descricao || !novaAula.duracao || !novaAula.instrutor) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        aulas.push(novaAula);
        atualizarTabelaAulas();
        $("#modalCadastroAulas").modal("hide");
        $("#formCadastroAulas")[0].reset();
    });

    $("#btnEditarAula").click(function () {
        if (aulaSelecionada !== null) {
            let aula = aulas[aulaSelecionada];
            $("#idEdicaoAulas").val(aulaSelecionada);
            $("#nomeEdicaoAulas").val(aula.nome);
            $("#descricaoEdicaoAulas").val(aula.descricao);
            $("#duracaoEdicaoAulas").val(aula.duracao);
            $("#instrutorEdicaoAulas").val(aula.instrutor);
        }
    });

    $("#formEdicaoAulas").submit(function (event) {
        event.preventDefault();

        let duracao = $("#duracaoEdicaoAulas").val().trim();

        if (!validarDuracao(duracao)) {
            return;
        }

        let id = parseInt($("#idEdicaoAulas").val());

        if (!isNaN(id)) {
            aulas[id] = {
                nome: $("#nomeEdicaoAulas").val().trim(),
                descricao: $("#descricaoEdicaoAulas").val().trim(),
                duracao: duracao,
                instrutor: $("#instrutorEdicaoAulas").val().trim()
            };
            atualizarTabelaAulas();
            $("#modalEdicaoAulas").modal("hide");
        }
    });


    $("#btnRemoverAula").click(function () {
        if (aulaSelecionada !== null) {
            if (confirm("Tem certeza que deseja remover esta aula?")) {
                aulas.splice(aulaSelecionada, 1);
                atualizarTabelaAulas();
                aulaSelecionada = null;
                $("#btnEditarAula, #btnRemoverAula").prop("disabled", true);
            }
        }
    });

    atualizarTabelaAulas();

    //CARGOS
    let cargos = [];
    let cargoSelecionado = null;

    function atualizarTabelaCargos() {
        let tabela = $("#tabelaCargos");
        tabela.empty();
        cargos.forEach((cargo, index) => {
            tabela.append(`
                    <tr onclick="selecionarLinhaCargos(this, ${index})">
                        <td>${index + 1}</td>
                        <td>${cargo.nome}</td>
                        <td>${cargo.salario}</td>
                        <td>${cargo.comissao}</td>
                    </tr>
                `);
        });

        $("#btnEditarCargo, #btnRemoverCargo").prop("disabled", true);
    }

    window.selecionarLinhaCargos = function (linha, id) {
        $("#tabelaCargos tr").removeClass("table-active");
        $(linha).addClass("table-active");
        cargoSelecionado = id;
        $("#btnEditarCargo, #btnRemoverCargo").prop("disabled", false);
    };

    $("#formCadastroCargos").submit(function (event) {
        event.preventDefault();

        let nome = $("#nomeCadastroCargo").val().trim();
        let salario = $("#salarioCadastroCargo").val().trim();
        let comissao = $("#comissaoCadastroCargo").val().trim() || "0%";

        formatarSalario($("#salarioCadastroCargo")[0]);
        formatarComissao($("#comissaoCadastroCargo")[0]);

        if (!validarSalario(salario)) {
            alert("Salário inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        if (!validarComissao(comissao)) {
            alert("Comissão inválida! Apenas números de 0 a 99 seguidos de '%'.");
            return;
        }

        if (!nome || !salario) {
            alert("Nome e Salário são obrigatórios!");
            return;
        }

        cargos.push({ nome, salario, comissao });
        atualizarTabelaCargos();
        $("#modalCadastroCargos").modal("hide");
        $("#formCadastroCargos")[0].reset();
    });

    $("#btnEditarCargo").click(function () {
        if (cargoSelecionado !== null) {
            let cargo = cargos[cargoSelecionado];
            $("#idEdicaoCargo").val(cargoSelecionado);
            $("#nomeEdicaoCargo").val(cargo.nome);
            $("#salarioEdicaoCargo").val(cargo.salario);
            $("#comissaoEdicaoCargo").val(cargo.comissao.replace("%", ""));
        }
    });

    $("#formEdicaoCargos").submit(function (event) {
        event.preventDefault();
        let id = parseInt($("#idEdicaoCargo").val());

        let nome = $("#nomeEdicaoCargo").val().trim();
        let salario = $("#salarioEdicaoCargo").val().trim();
        let comissao = $("#comissaoEdicaoCargo").val().trim() || "0%";

        formatarSalario($("#salarioEdicaoCargo")[0]);
        formatarComissao($("#comissaoEdicaoCargo")[0]);

        if (!validarSalario(salario)) {
            alert("Salário inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        if (!validarComissao(comissao)) {
            alert("Comissão inválida! Apenas números de 0 a 99 seguidos de '%'.");
            return;
        }

        if (!isNaN(id)) {
            cargos[id] = { nome, salario, comissao };
            atualizarTabelaCargos();
            $("#modalEdicaoCargos").modal("hide");
        }
    });

    $("#btnRemoverCargo").click(function () {
        if (cargoSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este cargo?")) {
                cargos.splice(cargoSelecionado, 1);
                atualizarTabelaCargos();
                cargoSelecionado = null;
                $("#btnEditarCargo, #btnRemoverCargo").prop("disabled", true);
            }
        }
    });

    atualizarTabelaCargos();

    function formatarSalario(input) {
        let valor = input.value.replace(/\D/g, "");
        valor = (parseFloat(valor) / 100).toFixed(2);
        valor = valor.replace(".", ",");
        valor = "R$ " + valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valor;
    }

    $("#salarioCadastroCargo, #salarioEdicaoCargo").on("input", function () {
        formatarSalario(this);
    });

    function formatarComissao(input) {
        let valor = input.value.replace(/\D/g, "");
        valor = valor.substring(0, 2);
        if (valor.length > 0) valor += "%";
        input.value = valor;
    }

    $("#comissaoCadastroCargo, #comissaoEdicaoCargo").on("input", function () {
        formatarComissao(this);
    });

    function validarSalario(valor) {
        return /^R\$ (\d{1,3}(\.\d{3})*),\d{2}$/.test(valor);
    }

    function validarComissao(valor) {
        return /^([0-9]{1,2})%$/.test(valor) || valor === "0%";
    }

    $("#formCadastroCargos, #formEdicaoCargos").submit(function (event) {
        let salarioCampo = $(this).find("input[id^='salario']");
        let comissaoCampo = $(this).find("input[id^='comissao']");

        formatarSalario(salarioCampo[0]);
        formatarComissao(comissaoCampo[0]);

        if (!validarSalario(salarioCampo.val())) {
            event.preventDefault();
        }

        if (!validarComissao(comissaoCampo.val())) {
            event.preventDefault();
        }
    });

    //CLIENTES
    let clientes = [];
    let clienteSelecionado = null;

    function atualizarTabelaClientes() {
        let tabela = $("#tabelaClientes");
        tabela.empty();
        clientes.forEach((cliente, index) => {
            tabela.append(`
                    <tr onclick="selecionarLinhaClientes(this, ${index})">
                        <td>${index + 1}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.cpf}</td>
                        <td>${cliente.sexo}</td>
                        <td>${cliente.dataNascimento}</td>
                        <td>${cliente.endereco}</td>
                        <td>${cliente.telefone}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.inicioAcademia}</td>
                        <td>${cliente.plano}</td>
                        <td>${cliente.statusPagamento}</td>
                    </tr>
                `);
        });

        $("#btnEditarCliente, #btnRemoverCliente").prop("disabled", true);
    }

    window.selecionarLinhaClientes = function (linha, id) {
        $("#tabelaClientes tr").removeClass("table-active");
        $(linha).addClass("table-active");
        clienteSelecionado = id;
        $("#btnEditarCliente, #btnRemoverCliente").prop("disabled", false);
    };

    function formatarCPF(cpf) {
        return cpf.replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    $("#cpfCadastroCliente, #cpfEdicaoCliente").on("input", function () {
        this.value = formatarCPF(this.value);
    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11) return false;
        return !/^(\d)\1{10}$/.test(cpf);
    }

    function formatarTelefone(telefone) {
        return telefone.replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    }

    function validarTelefone(telefone) {
        if (telefone.length < 14) return true;
    }

    $("#telefoneCadastroCliente, #telefoneEdicaoCliente").on("input", function () {
        this.value = formatarTelefone(this.value);
    });

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    $("#formCadastroClientes").submit(function (event) {
        event.preventDefault();

        let cliente = {
            nome: $("#nomeCadastroCliente").val().trim(),
            cpf: $("#cpfCadastroCliente").val().trim(),
            sexo: $("#sexoCadastroCliente").val(),
            dataNascimento: $("#dataNascimentoCadastroCliente").val(),
            endereco: $("#enderecoCadastroCliente").val().trim(),
            telefone: $("#telefoneCadastroCliente").val().trim(),
            email: $("#emailCadastroCliente").val().trim(),
            inicioAcademia: $("#dataInicioAcademiaCadastroCliente").val(),
            plano: $("#planoCadastroCliente").val(),
            statusPagamento: $("#statusCadastroCliente").val()
        };

        if (!cliente.nome || !cliente.cpf || !cliente.sexo || !cliente.dataNascimento ||
            !cliente.endereco || !cliente.telefone || !cliente.email ||
            !cliente.inicioAcademia || !cliente.plano || !cliente.statusPagamento) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(cliente.cpf)) {
            alert("CPF inválido! Verifique e tente novamente.");
            return;
        }

        if (!validarEmail(cliente.email)) {
            alert("E-mail inválido! Verifique e tente novamente.");
            return;
        }

        if (validarTelefone(cliente.telefone)) {
            alert("Telefone inválido! Verifique e tente novamente.");
            return;
        }

        clientes.push(cliente);
        atualizarTabelaClientes();
        $("#modalCadastroClientes").modal("hide");
        $("#formCadastroClientes")[0].reset();
    });

    $("#btnEditarCliente").click(function () {
        $("#idEdicaoCliente").val(clienteSelecionado);

        if (clienteSelecionado !== null) {
            let cliente = clientes[clienteSelecionado];

            $("#idEdicaoCliente").val(clienteSelecionado);

            $("#nomeEdicaoCliente").val(cliente.nome);
            $("#cpfEdicaoCliente").val(cliente.cpf);
            $("#sexoEdicaoCliente").val(cliente.sexo);
            $("#dataNascimentoEdicaoCliente").val(cliente.dataNascimento);
            $("#enderecoEdicaoCliente").val(cliente.endereco);
            $("#telefoneEdicaoCliente").val(cliente.telefone);
            $("#emailEdicaoCliente").val(cliente.email);
            $("#dataInicioAcademiaEdicaoCliente").val(cliente.inicioAcademia);
            $("#planoEdicaoCliente").val(cliente.plano);
            $("#statusEdicaoCliente").val(cliente.statusPagamento);
        }
    });

    $("#formEdicaoClientes").submit(function (event) {
        event.preventDefault();

        let id = Number($("#idEdicaoCliente").val());

        if (isNaN(id) || id < 0 || id >= clientes.length) {
            alert("Erro ao editar cliente. Índice inválido!");
            return;
        }

        let clienteAtualizado = {
            nome: $("#nomeEdicaoCliente").val().trim(),
            cpf: $("#cpfEdicaoCliente").val().trim(),
            sexo: $("#sexoEdicaoCliente").val(),
            dataNascimento: $("#dataNascimentoEdicaoCliente").val(),
            endereco: $("#enderecoEdicaoCliente").val().trim(),
            telefone: $("#telefoneEdicaoCliente").val().trim(),
            email: $("#emailEdicaoCliente").val().trim(),
            inicioAcademia: $("#dataInicioAcademiaEdicaoCliente").val(),
            plano: $("#planoEdicaoCliente").val(),
            statusPagamento: $("#statusEdicaoCliente").val()
        };

        if (!clienteAtualizado.nome || !clienteAtualizado.cpf || !clienteAtualizado.sexo ||
            !clienteAtualizado.dataNascimento || !clienteAtualizado.endereco ||
            !clienteAtualizado.telefone || !clienteAtualizado.email ||
            !clienteAtualizado.inicioAcademia || !clienteAtualizado.plano ||
            !clienteAtualizado.statusPagamento) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(clienteAtualizado.cpf)) {
            alert("CPF inválido! Verifique e tente novamente.");
            return;
        }

        if (!validarEmail(clienteAtualizado.email)) {
            alert("E-mail inválido! Verifique e tente novamente.");
            return;
        }

        if (validarTelefone(clienteAtualizado.telefone)) {
            alert("Telefone inválido! Verifique e tente novamente.");
            return;
        }

        clientes[id] = clienteAtualizado;
        atualizarTabelaClientes();
        $("#modalEdicaoClientes").modal("hide");
    });

    $("#btnRemoverCliente").click(function () {
        if (clienteSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este cliente?")) {
                clientes.splice(clienteSelecionado, 1);
                atualizarTabelaClientes();
                clienteSelecionado = null;
                $("#btnEditarCliente, #btnRemoverCliente").prop("disabled", true);
            }
        }
    });

    atualizarTabelaClientes();

    //PRODUTOS
    let produtos = [];
    let produtoSelecionado = null;

    function atualizarTabelaProdutos() {
        let tabela = $("#tabelaEstoque");
        tabela.empty();
        produtos.forEach((produto, index) => {
            tabela.append(`
            <tr onclick="selecionarLinhaProduto(this, ${index})">
                <td>${index + 1}</td>
                <td>${produto.nome}</td>
                <td>${produto.preco}</td>
                <td>${produto.descricao}</td>
                <td>${produto.fabricante}</td>
                <td>${produto.quantidade}</td>
            </tr>
        `);
        });

        $("#btnEditarProduto, #btnRemoverProduto").prop("disabled", true);
    }

    window.selecionarLinhaProduto = function (linha, id) {
        $("#tabelaEstoque tr").removeClass("table-active");
        $(linha).addClass("table-active");
        produtoSelecionado = id;
        $("#btnEditarProduto, #btnRemoverProduto").prop("disabled", false);
    };

    $("#formCadastroProduto").submit(function (event) {
        event.preventDefault();

        let nome = $("#nomeCadastroProduto").val().trim();
        let preco = $("#precoCadastroProduto").val().trim();
        let descricao = $("#descricaoCadastroProduto").val().trim();
        let fabricante = $("#fabricanteCadastroProduto").val().trim();
        let quantidade = $("#quantidadeCadastroProduto").val().trim();

        formatarPreco($("#precoCadastroProduto")[0]);

        if (!validarPreco(preco)) {
            alert("Preço inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        if (!nome || !preco || !descricao || !fabricante || !quantidade) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        produtos.push({ nome, preco, descricao, fabricante, quantidade });
        atualizarTabelaProdutos();
        $("#modalCadastroProduto").modal("hide");
        $("#formCadastroProduto")[0].reset();
    });

    $("#btnEditarProduto").click(function () {
        if (produtoSelecionado !== null) {
            let produto = produtos[produtoSelecionado];
            $("#idEdicaoProduto").val(produtoSelecionado);
            $("#nomeEdicaoProduto").val(produto.nome);
            $("#precoEdicaoProduto").val(produto.preco);
            $("#descricaoEdicaoProduto").val(produto.descricao);
            $("#fabricanteEdicaoProduto").val(produto.fabricante);
            $("#quantidadeEdicaoProduto").val(produto.quantidade);
        }
    });

    $("#formEdicaoProduto").submit(function (event) {
        event.preventDefault();
        let id = parseInt($("#idEdicaoProduto").val());

        let nome = $("#nomeEdicaoProduto").val().trim();
        let preco = $("#precoEdicaoProduto").val().trim();
        let descricao = $("#descricaoEdicaoProduto").val().trim();
        let fabricante = $("#fabricanteEdicaoProduto").val().trim();
        let quantidade = $("#quantidadeEdicaoProduto").val().trim();

        formatarPreco($("#precoEdicaoProduto")[0]);

        if (!validarPreco(preco)) {
            alert("Preço inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        if (!nome || !preco || !descricao || !fabricante || !quantidade) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        produtos[id] = { nome, preco, descricao, fabricante, quantidade };
        atualizarTabelaProdutos();
        $("#modalEdicaoProduto").modal("hide");
    });

    $("#btnRemoverProduto").click(function () {
        if (produtoSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este produto?")) {
                produtos.splice(produtoSelecionado, 1);
                atualizarTabelaProdutos();
                produtoSelecionado = null;
                $("#btnEditarProduto, #btnRemoverProduto").prop("disabled", true);
            }
        }
    });

    function formatarPreco(input) {
        let valor = input.value.replace(/\D/g, "");
        valor = (parseFloat(valor) / 100).toFixed(2);
        valor = valor.replace(".", ",");
        valor = "R$ " + valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valor;
    }

    $("#precoCadastroProduto, #precoEdicaoProduto").on("input", function () {
        formatarPreco(this);
    });

    function validarPreco(valor) {
        return /^R\$ (\d{1,3}(\.\d{3})*),\d{2}$/.test(valor);
    }

    atualizarTabelaProdutos();

    //RECEITAS
    let receitas = [];
    let receitaSelecionada = null;

    function atualizarTabelaReceitas() {
        let tabela = $("#tabelaReceitas");
        tabela.empty();
        receitas.forEach((receita, index) => {
            tabela.append(`
            <tr onclick="selecionarLinhaReceita(this, ${index})">
                <td>${index + 1}</td>
                <td>${receita.tipo}</td>
                <td>${receita.valor}</td>
                <td>${formatarDataBR(receita.data)}</td>
                <td>${receita.descricao}</td>
            </tr>
        `);
        });

        $("#btnEditarReceita, #btnRemoverReceita").prop("disabled", true);
    }

    window.selecionarLinhaReceita = function (linha, id) {
        $("#tabelaReceitas tr").removeClass("table-active");
        $(linha).addClass("table-active");
        receitaSelecionada = id;
        $("#btnEditarReceita, #btnRemoverReceita").prop("disabled", false);
    };

    function formatarValor(input) {
        let valor = input.value.replace(/\D/g, "");
        if (valor.length === 0) {
            input.value = "R$ 0,00";
            return;
        }

        valor = (parseFloat(valor) / 100).toFixed(2).replace(".", ",");
        valor = "R$ " + valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valor;
    }

    $("#valorCadastroReceita, #valorEdicaoReceita").on("input", function () {
        formatarValor(this);
    });

    function validarValor(valor) {
        return /^R\$ (\d{1,3}(\.\d{3})*),\d{2}$/.test(valor);
    }

    $("#formCadastroReceitas").submit(function (event) {
        event.preventDefault();

        let tipo = $("#tipoCadastroReceita").val().trim();
        let valor = $("#valorCadastroReceita").val().trim();
        let data = $("#dataCadastroReceita").val();
        let descricao = $("#descricaoCadastroReceita").val().trim();

        formatarValor($("#valorCadastroReceita")[0]);

        if (!tipo || !valor || !data) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (!validarValor(valor)) {
            alert("Valor inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        receitas.push({ tipo, valor, data, descricao });
        atualizarTabelaReceitas();
        $("#modalCadastroReceitas").modal("hide");
        $("#formCadastroReceitas")[0].reset();
    });

    $("#btnEditarReceita").click(function () {
        if (receitaSelecionada !== null) {
            let receita = receitas[receitaSelecionada];

            $("#idEdicaoReceita").val(receitaSelecionada);
            $("#tipoEdicaoReceita").val(receita.tipo);
            $("#valorEdicaoReceita").val(receita.valor);
            $("#dataEdicaoReceita").val(receita.data);
            $("#descricaoEdicaoReceita").val(receita.descricao);
        }
    });

    $("#formEdicaoReceitas").submit(function (event) {
        event.preventDefault();

        let id = parseInt($("#idEdicaoReceita").val());

        if (isNaN(id) || id < 0 || id >= receitas.length) {
            alert("Erro ao editar receita. Índice inválido!");
            return;
        }

        let tipo = $("#tipoEdicaoReceita").val().trim();
        let valor = $("#valorEdicaoReceita").val().trim();
        let data = $("#dataEdicaoReceita").val();
        let descricao = $("#descricaoEdicaoReceita").val().trim();

        formatarValor($("#valorEdicaoReceita")[0]);

        if (!tipo || !valor || !data) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (!validarValor(valor)) {
            alert("Valor inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        receitas[id] = { tipo, valor, data, descricao };
        atualizarTabelaReceitas();
        $("#modalEdicaoReceitas").modal("hide");
    });

    $("#btnRemoverReceita").click(function () {
        if (receitaSelecionada !== null) {
            if (confirm("Tem certeza que deseja remover esta receita?")) {
                receitas.splice(receitaSelecionada, 1);
                atualizarTabelaReceitas();
                receitaSelecionada = null;
                $("#btnEditarReceita, #btnRemoverReceita").prop("disabled", true);
            }
        }
    });

    atualizarTabelaReceitas();

    //DESPESAS
    let despesas = [];
    let despesaSelecionada = null;

    function atualizarTabelaDespesas() {
        let tabela = $("#tabelaDespesas");
        tabela.empty();
        despesas.forEach((despesa, index) => {
            tabela.append(`
        <tr onclick="selecionarLinhaDespesa(this, ${index})">
            <td>${index + 1}</td>
            <td>${despesa.tipo}</td>
            <td>${despesa.valor}</td>
            <td>${formatarDataBR(despesa.data)}</td>
            <td>${despesa.descricao}</td>
        </tr>
    `);
        });

        $("#btnEditarDespesa, #btnRemoverDespesa").prop("disabled", true);
    }

    window.selecionarLinhaDespesa = function (linha, id) {
        $("#tabelaDespesas tr").removeClass("table-active");
        $(linha).addClass("table-active");
        despesaSelecionada = id;
        $("#btnEditarDespesa, #btnRemoverDespesa").prop("disabled", false);
    };

    function formatarValor(input) {
        let valor = input.value.replace(/\D/g, "");
        if (valor.length === 0) {
            input.value = "R$ 0,00";
            return;
        }

        valor = (parseFloat(valor) / 100).toFixed(2).replace(".", ",");
        valor = "R$ " + valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valor;
    }

    $("#valorCadastroDespesa, #valorEdicaoDespesa").on("input", function () {
        formatarValor(this);
    });

    function validarValor(valor) {
        return /^R\$ (\d{1,3}(\.\d{3})*),\d{2}$/.test(valor);
    }

    $("#formCadastroDespesas").submit(function (event) {
        event.preventDefault();

        let tipo = $("#tipoCadastroDespesa").val().trim();
        let valor = $("#valorCadastroDespesa").val().trim();
        let data = $("#dataCadastroDespesa").val();
        let descricao = $("#descricaoCadastroDespesa").val().trim();

        formatarValor($("#valorCadastroDespesa")[0]);

        if (!tipo || !valor || !data) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (!validarValor(valor)) {
            alert("Valor inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        despesas.push({ tipo, valor, data, descricao });
        atualizarTabelaDespesas();
        $("#modalCadastroDespesas").modal("hide");
        $("#formCadastroDespesas")[0].reset();
    });

    $("#btnEditarDespesa").click(function () {
        if (despesaSelecionada !== null) {
            let despesa = despesas[despesaSelecionada];

            $("#idEdicaoDespesa").val(despesaSelecionada);
            $("#tipoEdicaoDespesa").val(despesa.tipo);
            $("#valorEdicaoDespesa").val(despesa.valor);
            $("#dataEdicaoDespesa").val(despesa.data);
            $("#descricaoEdicaoDespesa").val(despesa.descricao);
        }
    });

    $("#formEdicaoDespesas").submit(function (event) {
        event.preventDefault();

        let id = parseInt($("#idEdicaoDespesa").val());

        if (isNaN(id) || id < 0 || id >= despesas.length) {
            alert("Erro ao editar despesa. Índice inválido!");
            return;
        }

        let tipo = $("#tipoEdicaoDespesa").val().trim();
        let valor = $("#valorEdicaoDespesa").val().trim();
        let data = $("#dataEdicaoDespesa").val();
        let descricao = $("#descricaoEdicaoDespesa").val().trim();

        formatarValor($("#valorEdicaoDespesa")[0]);

        if (!tipo || !valor || !data) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (!validarValor(valor)) {
            alert("Valor inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        despesas[id] = { tipo, valor, data, descricao };
        atualizarTabelaDespesas();
        $("#modalEdicaoDespesas").modal("hide");
    });

    $("#btnRemoverDespesa").click(function () {
        if (despesaSelecionada !== null) {
            if (confirm("Tem certeza que deseja remover esta despesa?")) {
                despesas.splice(despesaSelecionada, 1);
                atualizarTabelaDespesas();
                despesaSelecionada = null;
                $("#btnEditarDespesa, #btnRemoverDespesa").prop("disabled", true);
            }
        }
    });

    atualizarTabelaDespesas();

    //FINANCEIRO
    let relatorios = [];
    let relatorioSelecionado = null;

    receitas = [
        { data: "2025-03-01", valor: "R$ 1.500,00" },
        { data: "2025-03-05", valor: "R$ 2.000,00" },
        { data: "2025-03-10", valor: "R$ 500,00" }
    ];

    despesas = [
        { data: "2025-03-02", valor: "R$ 700,00" },
        { data: "2025-03-06", valor: "R$ 1.200,00" },
        { data: "2025-03-12", valor: "R$ 300,00" }
    ];

    function converterValor(valor) {
        return parseFloat(valor.replace(/R\$|\./g, "").replace(",", "."));
    }

    function formatarMoeda(valor) {
        return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function atualizarTabelaRelatorios() {
        let tabela = $("#tabelaRelatorios");
        tabela.empty();

        relatorios.forEach((relatorio, index) => {
            tabela.append(`
            <tr onclick="selecionarLinhaRelatorio(this, ${index})">
                <td>${index + 1}</td>
                <td>${formatarDataBR(relatorio.dataInicio)}</td>
                <td>${formatarDataBR(relatorio.dataFim)}</td>
                <td>${formatarMoeda(relatorio.totalReceitas)}</td>
                <td>${formatarMoeda(relatorio.totalDespesas)}</td>
                <td>${formatarMoeda(relatorio.saldo)}</td>
                <td class="${relatorio.status === 'POSITIVO' ? 'text-success' : relatorio.status === 'NEGATIVO' ? 'text-danger' : 'text-warning'}">
                    ${relatorio.status}
                </td>
            </tr>
        `);
        });

        $("#btnRemoverRelatorio").prop("disabled", true);
    }

    window.selecionarLinhaRelatorio = function (linha, id) {
        $("#tabelaRelatorios tr").removeClass("table-active");
        $(linha).addClass("table-active");
        relatorioSelecionado = id;
        $("#btnRemoverRelatorio").prop("disabled", false);
    };

    $("#formNovoRelatorio").submit(function (event) {
        event.preventDefault();

        let dataInicio = $("#dataInicio").val();
        let dataFim = $("#dataFim").val();

        if (!dataInicio || !dataFim || new Date(dataInicio) > new Date(dataFim)) {
            alert("Informe um intervalo de datas válido!");
            return;
        }

        console.log("Data início:", dataInicio);
        console.log("Data fim:", dataFim);

        let totalReceitas = receitas
            .map(r => ({ ...r, data: new Date(r.data) }))
            .filter(r => r.data >= new Date(dataInicio) && r.data <= new Date(dataFim))
            .reduce((sum, r) => sum + converterValor(r.valor), 0);

        let totalDespesas = despesas
            .map(d => ({ ...d, data: new Date(d.data) }))
            .filter(d => d.data >= new Date(dataInicio) && d.data <= new Date(dataFim))
            .reduce((sum, d) => sum + converterValor(d.valor), 0);

        console.log("Total Receitas:", totalReceitas);
        console.log("Total Despesas:", totalDespesas);

        let saldo = totalReceitas - totalDespesas;
        let status = saldo > 0 ? "POSITIVO" : saldo < 0 ? "NEGATIVO" : "NEUTRO";

        relatorios.push({ dataInicio, dataFim, totalReceitas, totalDespesas, saldo, status });

        console.log("Relatórios:", relatorios);

        atualizarTabelaRelatorios();
        $("#modalNovoRelatorio").modal("hide");
        $("#formNovoRelatorio")[0].reset();
    });

    $("#btnRemoverRelatorio").click(function () {
        if (relatorioSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este relatório?")) {
                relatorios.splice(relatorioSelecionado, 1);
                atualizarTabelaRelatorios();
                relatorioSelecionado = null;
                $("#btnRemoverRelatorio").prop("disabled", true);
            }
        }
    });

    atualizarTabelaRelatorios();

    //FUNCIONÁRIOS
    let funcionarios = [];
    let funcionarioSelecionado = null;

    function atualizarTabelaFuncionarios() {
        let tabela = $("#tabelaFuncionarios");
        tabela.empty();
        funcionarios.forEach((funcionario, index) => {
            tabela.append(`
                    <tr onclick="selecionarLinhaFuncionarios(this, ${index})">
                        <td>${index + 1}</td>
                        <td>${funcionario.nome}</td>
                        <td>${funcionario.cpf}</td>
                        <td>${funcionario.cargo}</td>
                    </tr>
                `);
        });
        $("#btnEditarFuncionario, #btnRemoverFuncionario").prop("disabled", true);
    }

    window.selecionarLinhaFuncionarios = function (linha, id) {
        $("#tabelaFuncionarios tr").removeClass("table-active");
        $(linha).addClass("table-active");
        funcionarioSelecionado = id;
        $("#btnEditarFuncionario, #btnRemoverFuncionario").prop("disabled", false);
    };

    function formatarCPF(cpf) {
        return cpf.replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    $("#cpfFuncionario, #cpfEdicaoFuncionario").on("input", function () {
        this.value = formatarCPF(this.value);
    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11) return false;
        return !/^(\d)\1{10}$/.test(cpf);
    }

    $("#formCadastroFuncionario").submit(function (event) {
        event.preventDefault();

        let nome = $("#nomeFuncionario").val().trim();
        let cpf = $("#cpfFuncionario").val().trim();
        let cargo = $("#cargoFuncionario").val();

        if (!nome || !cpf || !cargo) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido! Verifique e tente novamente.");
            return;
        }

        funcionarios.push({ nome, cpf, cargo });
        atualizarTabelaFuncionarios();
        $("#modalCadastroFuncionario").modal("hide");
        $("#formCadastroFuncionario")[0].reset();
    });

    $("#btnEditarFuncionario").click(function () {
        if (funcionarioSelecionado !== null) {
            let funcionario = funcionarios[funcionarioSelecionado];
            $("#idEdicaoFuncionario").val(funcionarioSelecionado);
            $("#nomeEdicaoFuncionario").val(funcionario.nome);
            $("#cpfEdicaoFuncionario").val(funcionario.cpf);
            $("#cargoEdicaoFuncionario").val(funcionario.cargo);
            $("#modalEdicaoFuncionario").modal("show");
        }
    });

    $("#formEdicaoFuncionario").submit(function (event) {
        event.preventDefault();

        let id = Number($("#idEdicaoFuncionario").val());
        if (isNaN(id) || id < 0 || id >= funcionarios.length) {
            alert("Erro ao editar funcionário. Índice inválido!");
            return;
        }

        let nome = $("#nomeEdicaoFuncionario").val().trim();
        let cpf = $("#cpfEdicaoFuncionario").val().trim();
        let cargo = $("#cargoEdicaoFuncionario").val();

        if (!nome || !cpf || !cargo) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido! Verifique e tente novamente.");
            return;
        }

        funcionarios[id] = { nome, cpf, cargo };
        atualizarTabelaFuncionarios();
        $("#modalEdicaoFuncionario").modal("hide");
    });

    $("#btnRemoverFuncionario").click(function () {
        if (funcionarioSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este funcionário?")) {
                funcionarios.splice(funcionarioSelecionado, 1);
                atualizarTabelaFuncionarios();
                funcionarioSelecionado = null;
                $("#btnEditarFuncionario, #btnRemoverFuncionario").prop("disabled", true);
            }
        }
    });

    atualizarTabelaFuncionarios();

    //INSTRUTORES
    let instrutores = [];
    let instrutorSelecionado = null;

    function atualizarTabelaInstrutores() {
        let tabela = $("#tabelaInstrutores");
        tabela.empty();
        instrutores.forEach((instrutor, index) => {
            tabela.append(`
                    <tr onclick="selecionarLinhaInstrutores(this, ${index})">
                        <td>${index + 1}</td>
                        <td>${instrutor.nome}</td>
                        <td>${instrutor.email}</td>
                        <td>${instrutor.cpf}</td>
                        <td>${instrutor.telefone}</td>
                        <td>${instrutor.especialidade}</td>
                    </tr>
                `);
        });

        $("#btnEditarInstrutor, #btnRemoverInstrutor").prop("disabled", true);
    }

    window.selecionarLinhaInstrutores = function (linha, id) {
        $("#tabelaInstrutores tr").removeClass("table-active");
        $(linha).addClass("table-active");
        instrutorSelecionado = id;
        $("#btnEditarInstrutor, #btnRemoverInstrutor").prop("disabled", false);
    };

    $("#cpfCadastroInstrutor, #cpfEdicaoInstrutor").on("input", function () {
        this.value = formatarCPF(this.value);
    });

    $("#telefoneCadastroInstrutor, #telefoneEdicaoInstrutor").on("input", function () {
        this.value = formatarTelefone(this.value);
    });

    $("#formCadastroInstrutor").submit(function (event) {
        event.preventDefault();

        let instrutor = {
            nome: $("#nomeCadastroInstrutor").val().trim(),
            email: $("#emailCadastroInstrutor").val().trim(),
            cpf: $("#cpfCadastroInstrutor").val().trim(),
            telefone: $("#telefoneCadastroInstrutor").val(),
            especialidade: $("#especialidadeCadastroInstrutor").val()
        };

        if (!instrutor.nome || !instrutor.email || !instrutor.cpf || !instrutor.telefone ||
            !instrutor.especialidade) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(instrutor.cpf)) {
            alert("CPF inválido! Verifique e tente novamente.");
            return;
        }

        if (!validarEmail(instrutor.email)) {
            alert("E-mail inválido! Verifique e tente novamente.");
            return;
        }

        if (validarTelefone(instrutor.telefone)) {
            alert("Telefone inválido! Verifique e tente novamente.");
            return;
        }

        instrutores.push(instrutor);
        atualizarTabelaInstrutores();
        $("#modalCadastroInstrutor").modal("hide");
        $("#formCadastroInstrutor")[0].reset();
    });

    $("#btnEditarInstrutor").click(function () {
        console.log('instrutorSelecionado: ', instrutorSelecionado);
        $("#idEdicaoInstrutor").val(instrutorSelecionado);

        if (instrutorSelecionado !== null) {
            let instrutor = instrutores[instrutorSelecionado];

            $("#idEdicaoInstrutor").val(instrutorSelecionado);

            $("#nomeEdicaoInstrutor").val(instrutor.nome);
            $("#emailEdicaoInstrutor").val(instrutor.email);
            $("#cpfEdicaoInstrutor").val(instrutor.cpf);
            $("#telefoneEdicaoInstrutor").val(instrutor.telefone);
            $("#especialidadeEdicaoInstrutor").val(instrutor.especialidade);
        }
    });

    $("#formEdicaoInstrutor").submit(function (event) {
        event.preventDefault();

        let id = Number($("#idEdicaoInstrutor").val());

        if (isNaN(id) || id < 0 || id >= instrutores.length) {
            alert("Erro ao editar instrutor. Índice inválido!");
            return;
        }

        let instrutorAtualizado = {
            nome: $("#nomeEdicaoInstrutor").val().trim(),
            email: $("#emailEdicaoInstrutor").val().trim(),
            cpf: $("#cpfEdicaoInstrutor").val(),
            telefone: $("#telefoneEdicaoInstrutor").val(),
            especialidade: $("#especialidadeEdicaoInstrutor").val().trim()
        };

        if (!instrutorAtualizado.nome || !instrutorAtualizado.email || !instrutorAtualizado.cpf ||
            !instrutorAtualizado.telefone || !instrutorAtualizado.especialidade) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(instrutorAtualizado.cpf)) {
            alert("CPF inválido! Verifique e tente novamente.");
            return;
        }

        if (!validarEmail(instrutorAtualizado.email)) {
            alert("E-mail inválido! Verifique e tente novamente.");
            return;
        }

        if (validarTelefone(instrutorAtualizado.telefone)) {
            alert("Telefone inválido! Verifique e tente novamente.");
            return;
        }

        instrutores[id] = instrutorAtualizado;
        atualizarTabelaInstrutores();
        $("#modalEdicaoInstrutor").modal("hide");
    });

    $("#btnRemoverInstrutor").click(function () {
        if (instrutorSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este instrutor?")) {
                instrutores.splice(instrutorSelecionado, 1);
                atualizarTabelaInstrutores();
                instrutorSelecionado = null;
                $("#btnEditarInstrutor, #btnRemoverInstrutor").prop("disabled", true);
            }
        }
    });

    atualizarTabelaInstrutores();

    //PLANOS
    let planos = [];
    let planoSelecionado = null;

    function atualizarTabelaPlanos() {
        let tabela = $("#tabelaPlanos");
        tabela.empty();
        planos.forEach((plano, index) => {
            tabela.append(`
            <tr onclick="selecionarLinhaPlano(this, ${index})">
                <td>${index + 1}</td>
                <td>${plano.nome}</td>
                <td>${plano.precoMensal}</td>
                <td>${plano.recursosIncluidos}</td>
            </tr>
        `);
        });

        $("#btnEditarPlano, #btnRemoverPlano").prop("disabled", true);
    }

    window.selecionarLinhaPlano = function (linha, id) {
        $("#tabelaPlanos tr").removeClass("table-active");
        $(linha).addClass("table-active");
        planoSelecionado = id;
        $("#btnEditarPlano, #btnRemoverPlano").prop("disabled", false);
    };

    function validarCamposPlano(nome, preco, recursos) {
        return nome && preco && recursos;
    }

    $("#formCadastroPlanos").submit(function (event) {
        event.preventDefault();

        let nome = $("#nomeCadastroPlano").val().trim();
        let precoMensal = $("#precoMensalCadastroPlano").val().trim();
        let recursosIncluidos = $("#recursosIncluidosCadastroPlano").val().trim();

        formatarPreco($("#precoMensalCadastroPlano")[0]);

        if (!validarCamposPlano(nome, precoMensal, recursosIncluidos)) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarPreco(precoMensal)) {
            alert("Preço inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        planos.push({ nome, precoMensal, recursosIncluidos });
        atualizarTabelaPlanos();
        $("#modalCadastroPlanos").modal("hide");
        $("#formCadastroPlanos")[0].reset();
    });

    $("#btnEditarPlano").click(function () {
        if (planoSelecionado !== null) {
            let plano = planos[planoSelecionado];
            $("#idEdicaoPlanos").val(planoSelecionado);
            $("#nomeEdicaoPlano").val(plano.nome);
            $("#precoMensalEdicaoPlano").val(plano.precoMensal);
            $("#recursosIncluidosEdicaoPlano").val(plano.recursosIncluidos);
        }
    });

    $("#formEdicaoPlanos").submit(function (event) {
        event.preventDefault();

        let id = parseInt($("#idEdicaoPlanos").val());

        let nome = $("#nomeEdicaoPlano").val().trim();
        let precoMensal = $("#precoMensalEdicaoPlano").val().trim();
        let recursosIncluidos = $("#recursosIncluidosEdicaoPlano").val().trim();

        formatarPreco($("#precoMensalEdicaoPlano")[0]);

        if (!validarCamposPlano(nome, precoMensal, recursosIncluidos)) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarPreco(precoMensal)) {
            alert("Preço inválido! Use o formato correto (Ex: R$ 1.500,00).");
            return;
        }

        planos[id] = { nome, precoMensal, recursosIncluidos };
        atualizarTabelaPlanos();
        $("#modalEdicaoPlanos").modal("hide");
    });

    $("#btnRemoverPlano").click(function () {
        if (planoSelecionado !== null) {
            if (confirm("Tem certeza que deseja remover este plano?")) {
                planos.splice(planoSelecionado, 1);
                atualizarTabelaPlanos();
                planoSelecionado = null;
                $("#btnEditarPlano, #btnRemoverPlano").prop("disabled", true);
            }
        }
    });

    function formatarPreco(input) {
        let valor = input.value.replace(/\D/g, "");
        valor = (parseFloat(valor) / 100).toFixed(2);
        valor = valor.replace(".", ",");
        valor = "R$ " + valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valor;
    }

    function validarPreco(valor) {
        return /^R\$ (\d{1,3}(\.\d{3})*),\d{2}$/.test(valor);
    }

    $("#precoMensalCadastroPlano, #precoMensalEdicaoPlano").on("input", function () {
        formatarPreco(this);
    });

    atualizarTabelaPlanos();

    //VENDAS
    let vendas = [];
    let vendaSelecionada = null;
    let produtosVendidos = [];

    function formatarValor(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarDataHora(dataHora) {
        let dataObj = new Date(dataHora);

        if (isNaN(dataObj)) return "Data inválida";

        return dataObj.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
    }

    function atualizarTabelaVendas() {
        let tabela = $("#tabelaVendas");
        tabela.empty();
        vendas.forEach((venda, index) => {
            tabela.append(`
        <tr onclick="selecionarLinhaVenda(this, ${index})">
            <td>${index + 1}</td>  <!-- Exibe o ID -->
            <td>${venda.cliente}</td>
            <td>${formatarData(venda.dataHora)}</td>
            <td>${formatarValor(venda.total)}</td>
            <td>${venda.statusPagamento}</td>
            <td>${venda.funcionario}</td>
        </tr>
    `);
        });

        $("#btnEditarVenda, #btnRemoverVenda").prop("disabled", true);
    }

    window.selecionarLinhaVenda = function (linha, id) {
        $("#tabelaVendas tr").removeClass("table-active");
        $(linha).addClass("table-active");
        vendaSelecionada = id;
        $("#btnEditarVenda, #btnRemoverVenda").prop("disabled", false);
    };

    function atualizarTabelaProdutosAdicionados() {
        let tabela = $("#tabelaProdutosAdicionados tbody");
        tabela.empty();
        produtosVendidos.forEach(produto => {
            tabela.append(`
                <tr>
                    <td>${produto.produto}</td>
                    <td>${produto.quantidade}</td>
                    <td>${formatarValor(produto.valorUnitario)}</td>
                    <td>${formatarValor(produto.subtotal)}</td>
                </tr>
            `);
        });
    }

    function atualizarTotal() {
        let total = produtosVendidos.reduce((acc, produto) => acc + produto.subtotal, 0);

        if ($("#modalCadastroVenda").hasClass("show")) {
            $("#totalCadastroVenda").val(formatarValor(total));
        } else if ($("#modalEdicaoVenda").hasClass("show")) {
            $("#totalEdicaoVenda").val(formatarValor(total));
        }
    }

    $("#modalCadastroVenda").on("show.bs.modal", function () {
        produtosVendidos = [];
        atualizarTabelaProdutosAdicionados();
        $("#totalCadastroVenda").val("R$ 0,00");
    });

    $("#tipoPagamentoCadastroVenda, #tipoPagamentoEdicaoVenda").change(function () {
        let campoParcelas = $(this).attr("id") === "tipoPagamentoCadastroVenda" ?
            $("#parcelasCadastroVenda") : $("#parcelasEdicaoVenda");

        if ($(this).val() === "Crédito") {
            campoParcelas.prop("disabled", false);
        } else {
            campoParcelas.val(1);
            campoParcelas.prop("disabled", true);
        }
    });

    $("#btnAdicionarProduto").click(function () {
        let produto = $("#produtoCadastroVenda").val();
        let quantidade = parseInt($("#quantidadeCadastroVenda").val());

        if (produto === "Selecione um Produto" || !quantidade || quantidade <= 0) {
            alert("Por favor, selecione um produto válido e insira uma quantidade válida!");
            return;
        }

        let valorUnitario = 100;
        let subtotal = valorUnitario * quantidade;

        produtosVendidos.push({ produto, quantidade, valorUnitario, subtotal });

        atualizarTabelaProdutosAdicionados();
        atualizarTotal();
    });

    $("#formCadastroVenda").submit(function (event) {
        event.preventDefault();

        let cliente = $("#clienteCadastroVenda").val();
        let dataHora = $("#dataHoraCadastroVenda").val();
        let tipoPagamento = $("#tipoPagamentoCadastroVenda").val();
        let parcelas = $("#parcelasCadastroVenda").val();
        let statusPagamento = $("#statusPagamentoCadastroVenda").val();
        let funcionario = $("#funcionarioCadastroVenda").val();

        if (!cliente || !dataHora || !tipoPagamento || !statusPagamento || !funcionario) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (tipoPagamento === "Crédito" && parcelas === "") {
            alert("Se o pagamento for em Crédito, a quantidade de parcelas deve ser informada.");
            return;
        }

        let total = produtosVendidos.reduce((acc, produto) => acc + produto.subtotal, 0);
        vendas.push({
            cliente,
            dataHora,
            total,
            statusPagamento,
            produtosVendidos,
            tipoPagamento,
            parcelas,
            funcionario
        });

        $("#formCadastroVenda")[0].reset();
        produtosVendidos = [];
        atualizarTabelaVendas();
        atualizarTabelaProdutosAdicionados();
        $("#modalCadastroVenda").modal("hide");
    });

    $("#btnAdicionarProdutoEdicao").click(function () {
        let produto = $("#produtoEdicaoVenda").val();
        let quantidade = parseInt($("#quantidadeEdicaoVenda").val());

        if (produto === "Selecione um Produto" || !quantidade || quantidade <= 0) {
            alert("Por favor, selecione um produto válido e insira uma quantidade válida!");
            return;
        }

        let valorUnitario = 100;
        let subtotal = valorUnitario * quantidade;

        produtosVendidos.push({ produto, quantidade, valorUnitario, subtotal });

        atualizarTabelaProdutosAdicionados();
        atualizarTotal();
    });

    function formatarDataParaInput(dataHora) {
        let partes = dataHora.split(" ");
        let dataPartes = partes[0].split("/");
        let horaPartes = partes[1].split(":");

        let dia = dataPartes[0].padStart(2, "0");
        let mes = dataPartes[1].padStart(2, "0");
        let ano = dataPartes[2];

        let horas = horaPartes[0].padStart(2, "0");
        let minutos = horaPartes[1].padStart(2, "0");

        return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
    }


    $("#btnEditarVenda").click(function () {
        if (vendaSelecionada !== null) {
            let venda = vendas[vendaSelecionada];

            $("#idEdicaoVenda").val(vendaSelecionada);
            $("#clienteEdicaoVenda").val(venda.cliente);

            let [data, hora] = venda.dataHora.split(" ");
            let [dia, mes, ano] = data.split("/");
            let dataFormatada = `${ano}-${mes}-${dia}T${hora}`;

            $("#dataHoraEdicaoVenda").val(venda.dataHora);

            $("#tipoPagamentoEdicaoVenda").val(venda.tipoPagamento);
            $("#parcelasEdicaoVenda").val(venda.tipoPagamento === "Crédito" ? venda.parcelas : 1);
            $("#parcelasEdicaoVenda").prop("disabled", venda.tipoPagamento !== "Crédito");
            $("#statusPagamentoEdicaoVenda").val(venda.statusPagamento);
            $("#funcionarioEdicaoVenda").val(venda.funcionario);

            $("#totalEdicaoVenda").val(formatarValor(venda.total));

            produtosVendidos = [...venda.produtosVendidos];
            atualizarTabelaProdutosAdicionados();
            atualizarTotal();
        }
    });

    $("#formEdicaoVenda").submit(function (event) {
        event.preventDefault();

        let cliente = $("#clienteEdicaoVenda").val();
        let dataHora = $("#dataHoraEdicaoVenda").val();
        let tipoPagamento = $("#tipoPagamentoEdicaoVenda").val();
        let parcelas = $("#parcelasEdicaoVenda").val();
        let statusPagamento = $("#statusPagamentoEdicaoVenda").val();
        let funcionario = $("#funcionarioEdicaoVenda").val();

        if (!cliente || !dataHora || !tipoPagamento || !statusPagamento || !funcionario) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (tipoPagamento === "Crédito" && parcelas === "") {
            alert("Se o pagamento for em Crédito, a quantidade de parcelas deve ser informada.");
            return;
        }

        let total = produtosVendidos.reduce((acc, produto) => acc + produto.subtotal, 0);

        vendas[vendaSelecionada] = {
            cliente,
            dataHora,
            total,
            statusPagamento,
            produtosVendidos,
            tipoPagamento,
            parcelas,
            funcionario
        };

        produtosVendidos = [];
        atualizarTabelaVendas();
        atualizarTabelaProdutosAdicionados();
        $("#modalEdicaoVenda").modal("hide");
    });

    $("#btnRemoverVenda").click(function () {
        if (vendaSelecionada !== null) {
            if (confirm("Tem certeza que deseja remover esta venda?")) {
                vendas.splice(vendaSelecionada, 1);
                atualizarTabelaVendas();
                vendaSelecionada = null;
                $("#btnEditarVenda, #btnRemoverVenda").prop("disabled", true);
            }
        }
    });

    $("#tipoPagamentoCadastroVenda, #tipoPagamentoEdicaoVenda").change(function () {
        let tipoPagamento = $(this).val();
        if (tipoPagamento === "Crédito") {
            $("#parcelasCadastroVenda, #parcelasEdicaoVenda").prop("disabled", false);
        } else {
            $("#parcelasCadastroVenda, #parcelasEdicaoVenda").prop("disabled", true);
        }
    });

    atualizarTabelaVendas();

    function formatarDataBR(data) {
        if (!data) return "";
        let partes = data.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    //INDEX
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        window.location.href = "dashboard.html";
    });

    //DASHBOARD
    $("#logout").click(function () {
        window.location.href = "index.html";
    });

});
📊 Sistema de Gerenciamento de Notas (Gradebook)

Este projeto é uma aplicação Single Page Application (SPA) desenvolvida em Angular, focada na gestão e lançamento de notas de alunos por turma e disciplina.

A arquitetura interna segue rigorosos princípios de design para garantir modularidade, escalabilidade e fácil manutenção.

🚀 Tecnologias Utilizadas

Framework: Angular (Standalone Components)

Linguagem: TypeScript

Gerenciamento de Estado/Dados: RxJS (Observables)

UI/Design: Angular Material (com Tailwind CSS como base para o layout, se aplicável)

🏗️ Arquitetura do Projeto

O projeto adota o princípio de Domain-Driven Design (DDD) e Princípio da Responsabilidade Única (SRP), especialmente na camada de serviços (core).

Estrutura da Pasta core/

A pasta core foi dividida em domínios específicos, isolando a lógica, modelos e serviços de cada entidade.

Domínio

Caminho

Responsabilidade

Infraestrutura

core/api.service.ts

Única camada de comunicação HTTP (Mockada), utilizada por todos os serviços de domínio.

Classes

core/class/

Gerenciamento de Turmas (SchoolClass).

Disciplinas

core/subject/

Gerenciamento de Disciplinas (Subject) e Avaliações (Assessment).

Alunos

core/student/

Operações CRUD (Criação, Edição, Deleção) de Alunos.

Boletim

core/gradebook/

Lógica de processamento e salvamento dos lançamentos de notas (GradebookEntry).

Componentes

O componente principal, GradebookComponent, atua como um Container que:

Injeta os serviços de domínio (ex: ClassService, StudentService).

Gerencia o formulário reativo (filterForm e form de notas).

Coordena as ações do usuário (filtrar, salvar, adicionar aluno).

🧩 Serviços de Domínio (SRP)

O uso de múltiplos serviços no lugar de um único ApiService monolítico garante que cada serviço tenha apenas uma razão para mudar (SRP):

ClassService: Busca a lista de turmas.

SubjectService: Busca a lista de disciplinas e avaliações.

StudentService: Lida com a criação, atualização e deleção de alunos.

GradebookService: Lida com a busca dos dados de notas e o salvamento dos lançamentos.

⚙️ Instalação e Execução

Para rodar este projeto localmente, siga os passos abaixo:

Clone o repositório:

git clone [Repository](https://github.com/Oliveiraster/gradebook-F.git)
cd gradebook-f

Instale as dependências:

npm install

Execute o servidor de desenvolvimento:

ng serve

Navegue para http://localhost:4200/. A aplicação recarregará automaticamente se você fizer alterações nos arquivos fonte.

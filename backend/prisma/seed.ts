import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed do Banco de Dados SQLite...');

  // Limpeza de tabelas respeitando constraints
  await prisma.avaliacao.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.usuario.deleteMany();

  // Usuário Administrador
  const senhaAdminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador do Sistema',
      email: 'admin@ecommerce.com.br',
      senha: senhaAdminHash,
      papel: 'ADMIN',
    },
  });

  // Usuário Cliente com endereço
  const senhaClienteHash = await bcrypt.hash('123456', 10);
  const cliente = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao.silva@email.com.br',
      senha: senhaClienteHash,
      papel: 'CLIENTE',
      enderecos: {
        create: {
          rua: 'Avenida Paulista',
          numero: '1000',
          complemento: 'Apto 42',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          padrao: true,
        },
      },
    },
  });

  // Categorias
  const catEletronicos = await prisma.categoria.create({
    data: {
      nome: 'Eletrônicos & Smart',
      slug: 'eletronicos-e-smart',
      descricao: 'Smartphones, smartwatches e dispositivos inteligentes',
      imagemUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    },
  });

  const catAudio = await prisma.categoria.create({
    data: {
      nome: 'Áudio & Música',
      slug: 'audio-e-musica',
      descricao: 'Fones sem fio, caixas de som e cancelamento de ruído',
      imagemUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    },
  });

  const catPerifericos = await prisma.categoria.create({
    data: {
      nome: 'Periféricos & Setup',
      slug: 'perifericos-e-setup',
      descricao: 'Teclados mecânicos, mouses gamers e suportes ergonômicos',
      imagemUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Produtos
  const foneImagens = ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];
  await prisma.produto.create({
    data: {
      nome: 'Fone de Ouvido Bluetooth Pro ANC',
      slug: 'fone-de-ouvido-bluetooth-pro-anc',
      descricao: 'Fone circumaural com cancelamento de ruído ativo, drivers de alta fidelidade e bateria de até 40 horas contínuas.',
      preco: 799.90,
      estoque: 30,
      categoriaId: catAudio.id,
      imagemUrl: foneImagens[0],
      imagens: JSON.stringify(foneImagens),
      avaliacoes: {
        create: [
          {
            usuarioId: cliente.id,
            nota: 5,
            comentario: 'Excelente isolamento acústico e graves profundos. Vale cada centavo!',
          },
        ],
      },
    },
  });

  const watchImagens = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];
  await prisma.produto.create({
    data: {
      nome: 'Smartwatch Titan Series 9',
      slug: 'smartwatch-titan-series-9',
      descricao: 'Relógio inteligente com tela AMOLED vibrante, sensores cardíacos avançados, GPS integrado e resistência à água 50 metros.',
      preco: 1299.00,
      estoque: 15,
      categoriaId: catEletronicos.id,
      imagemUrl: watchImagens[0],
      imagens: JSON.stringify(watchImagens),
    },
  });

  const tecladoImagens = ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'];
  await prisma.produto.create({
    data: {
      nome: 'Teclado Mecânico RGB Sem Fio',
      slug: 'teclado-mecanico-rgb-sem-fio',
      descricao: 'Teclado compacto layout 75%, switches mecânicos lineares silenciosos, iluminação RGB por tecla e conexão tri-modo (Bluetooth, 2.4GHz e USB-C).',
      preco: 429.90,
      estoque: 50,
      categoriaId: catPerifericos.id,
      imagemUrl: tecladoImagens[0],
      imagens: JSON.stringify(tecladoImagens),
    },
  });

  console.log('Seed do SQLite finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

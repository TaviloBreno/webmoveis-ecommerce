import { seedCategories } from "./data/categories";
import { seedUsers } from "./data/users";

async function main(){
  console.log('🌱 Iniciando seed do banco de dados...');
  await seedCategories();
  await seedUsers();
  console.log('✅ Seed concluído com sucesso!');
}

main().catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
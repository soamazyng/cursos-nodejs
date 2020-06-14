echo "exec migrations"
node_modules/.bin/sequelize db:migrate
echo "running application"
npm run prod

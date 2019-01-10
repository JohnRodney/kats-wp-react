# Kats Guitars

1 Convert to Meteor / React App to -> Wordpress React Application

## Front End

### Tools

| Purpose       | Tool          |
| ---------     | -----         |
| Transpiling   | Babel         |
| Bundler       | Webpack       |
| Linting       | ESLint        |
| WebComponents | React         |
| Server        | Php /WP       |
| Database      | SQL           |
| Products      | Eforo         |
| Payments      | Authorize.net |

## Installing 
1. `git clone https://github.com/JohnRodney/kats-wp-react`
2. `npm install`

## Building
1. `npm run build`

## Running
1. `npm i -g live-server`
2. `live-server`

### package.json scripts
| script name | script purpose                   |
| ----------- | ----                            |
| transpile   | transpile src to lib directory  |
| bundle      | webpack bundle lib to bundle.js |
| build       | runs transpile then bundle      |

## Security 
All the requests to get products or make credit card transactions require an api key.
If you are working with this project with me then ask me for the theme-config.php file to make this work.

If you are here for some other reason you will have to make your own Eforo api key and Authorize.net api key
Authorize.net has sandbox keys for free
Eforo is part of the pawn masters POS system and is not a free key

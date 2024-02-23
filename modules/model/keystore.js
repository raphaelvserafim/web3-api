const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const Env = require("../../config/env");

const algorithm = 'aes-256-cbc';
const folder = '../../keystore';


class Keystore {

  static async encryptKeystore(keystore, password) {

    return new Promise((resolve, reject) => {
      const key = crypto.scryptSync(password, 'salt', 32);
      const iv = Buffer.alloc(16, 0);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encryptedKeystore = '';

      cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
          encryptedKeystore += chunk.toString('hex');
        }
      });

      cipher.on('end', () => {
        resolve(encryptedKeystore);
      });

      cipher.on('error', (error) => {
        reject(error);
      });

      cipher.write(JSON.stringify(keystore), 'utf8');
      cipher.end();
    });
  }

  static async decryptKeystore(encryptedKeystore, password) {
    return new Promise((resolve, reject) => {
      const key = crypto.scryptSync(password, 'salt', 32);
      const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decryptedKeystore = '';

      decipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = decipher.read())) {
          decryptedKeystore += chunk.toString('utf8');
        }
      });

      decipher.on('end', () => {
        resolve(JSON.parse(decryptedKeystore));
      });

      decipher.on('error', (error) => {
        reject(error);
      });

      decipher.write(encryptedKeystore, 'hex');
      decipher.end();
    });
  }



  static async save(address, keys) {
    try {
      const keystoreDirectory = path.resolve(__dirname, folder);
      if (!fs.existsSync(keystoreDirectory)) {
        fs.mkdirSync(keystoreDirectory, { recursive: true });
      }
      const encryptedKeys = await this.encryptKeystore(keys, Env.KEYSTORE_TOKEN);
      fs.writeFileSync(`${keystoreDirectory}/${address}.json`, encryptedKeys, 'utf8');
    } catch (error) {
      console.error('Erro ao salvar keystore:', error);
    }
  }


  static async load(address) {
    try {
      const keystoreDirectory = path.resolve(__dirname, folder);
      const encryptedKeystore = fs.readFileSync(`${keystoreDirectory}/${address}.json`, 'utf8');
      const decryptedKeys = await this.decryptKeystore(encryptedKeystore, Env.KEYSTORE_TOKEN);
      return decryptedKeys;
    } catch (error) {
      console.error('Erro ao carregar keystore:', error);
      return null;
    }
  }

}

module.exports = Keystore;

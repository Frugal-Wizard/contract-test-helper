import ganache, { EthereumProvider } from 'ganache';
import levelup from 'levelup';
import memdown from 'memdown';

interface Global {
    ethereum?: EthereumProvider;
}

const global = globalThis as Global;

export async function setUpEthereumProvider() {
    global.ethereum = ganache.provider({
        logging: {
            quiet: true,
        },
        database: {
            db: levelup(memdown()),
        },
        accounts: [
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000002',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000003',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000004',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000005',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000006',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000007',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000008',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x0000000000000000000000000000000000000000000000000000000000000009',
                balance: '0x3635c9adc5dea00000',
            },
            {
                secretKey: '0x000000000000000000000000000000000000000000000000000000000000000A',
                balance: '0x3635c9adc5dea00000',
            },
        ],
    });
}

export async function tearDownEthereumProvider() {
    delete global.ethereum;
}

## Hello guys!

## Step by step guide.
### Compilation contracts
```
npx hardhat compile 
```
### After this you can see typechain-types folder.

### Run script for deploy run
```
npx hardhat run scripts/deploy.ts --network sepolia
```

Examle result:
![](/static/npx_run_hardhat.png)

vasilijlazarev@MBP-Vasilij hw1 % npx hardhat run scripts/deploy.ts --network sepolia
Carti deployed to: 0xee408aEbCcFc3903a90e6E1e0d4F7231D5C67C08
Minted 1000 tokens to 0xf92769A0dFee5B4807daC7De454a0AE009886Fb0
Rub deployed to: 0xb83EdbB78B1f0B81A417426Fc6BAA9e312308913
Minted 1000 tokens of ID 0 to 0xf92769A0dFee5B4807daC7De454a0AE009886Fb0

Carti deployed to: [0xee408aEbCcFc3903a90e6E1e0d4F7231D5C67C08](https://sepolia.etherscan.io/address/0x505A54B597e8C55A18CFe626387dDa3D4a0ae989#code)

Kanye deployed to: [0xb83EdbB78B1f0B81A417426Fc6BAA9e312308913](https://sepolia.etherscan.io/address/0xa6fdF9A03E26d00330A586E3217bd2aB97F705eC#code)

Rub deployed to: [0x19D23776AdE766e3f7398F6121C1e81e9F17b3FF](https://sepolia.etherscan.io/address/0x19D23776AdE766e3f7398F6121C1e81e9F17b3FF#writeContract)


### Test run:
```
npx hardhat test
```

### Example result:

![](/static/tests_result.png)


Script for verification:
```
npx hardhat verify --network sepolia <contract address>
```



Get events script:
```
npx hardhat run scripts/queryEvents.ts --network sepolia
```

![](/static/events.png)
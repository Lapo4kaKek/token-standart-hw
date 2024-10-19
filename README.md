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


Carti deployed to: 0xD16278EAEE8457217a2512a54168991Cf1f2f6E9

Rub deployed to: 0xD16278EAEE8457217a2512a54168991Cf1f2f6E9

### Test run:
```
npx hardhat test
```

### Example result:

![](/static/tests_result.png)
const AddressListFactory = 'AddressListFactory'
module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()
  console.log('deployer = ', deployer)
  await deploy(AddressListFactory, {
    from: deployer,
    log: true,
    args: []
  })
}
module.exports.tags = [AddressListFactory]

## Introduction
When you set up Peach mobile wallet and need to deploy your own Lightning node, you have two options here. The first option is [installing a node using any cloud service](https://github.com/LightningPeach/lnd-gc-deploy/blob/master/README.md). The second one is to use node deployed on your PC from the Peach desktop wallet. The later variant is easier to implement and is cheaper to maintain as you don't need to pay for cloud services. To use node from your PC all you need is to install Peach desktop wallet. You control it and maintain it yourself, there is no need in custodial solutions.   

## Installing and configuring desktop node
Connect the Peach mobile wallet to your desktop node by doing the following:   

1) Download Peach desktop wallet from our [site](https://lightningpeach.com/peach-wallet).   

2) Install the downloaded application.   

3) Create an account on the desktop wallet by following the sign-up procedure described below:   

<img align="center" src="/peach-desktop-node/2019-04-04_16-47-45.png" width="447" height="534.75">   

<img align="center" src="/peach-desktop-node/2019-04-04_17-23-38.png" width="447" height="auto">   

<img align="center" src="/peach-desktop-node/2019-04-04_17-29-31.png" width="447" height="auto">   

<img align="center" src="/peach-desktop-node/2019-04-04_17-33-41.png" width="447" height="auto">   

<img align="center" src="/peach-desktop-node/2019-04-04_17-41-12.png" width="447" height="auto">   

<img align="center" src="/peach-desktop-node/2019-04-04_17-44-49.png" width="447" height="auto">  

Wait a couple of minutes for node to synchronize with Blockchain. Your node is up and running. 
Now let’s connect to it from mobile device.   

4) Open your wallet account.   

<img align="center" src="/peach-desktop-node/2019-04-04_17-51-10.png" width="447" height="auto">   

5) Open the **Profile** page.   

<img align="center" src="/peach-desktop-node/2019-04-08_12-29-12.png" width="447" height="auto">   

6) In the **Setting** section click the **Show QR** button.   

<img align="center" src="/peach-desktop-node/2019-04-08_12-34-07.png" width="447" height="auto">    

Steps listed within the window are duplicated below:   

a) Make sure you have public IP address.   

b) You need to set up port forwarding on your router for port 10014. Keep the same port number both externally and internally. 

c) Finally, you need to generate new QR code being located on the same network with the router.   

<img align="center" src="/peach-desktop-node/2019-04-08_12-39-56.png" width="447" height="auto">.       
d) Scan the QR code from the mobile application. Congratulations! You are ready to use your Desktop node.    

**Note:** The desktop node will be available as long as the wallet application is active, and the computer is online. If your external IP changes on the desktop, you will need to reconnect the mobile application using a new QR code.    

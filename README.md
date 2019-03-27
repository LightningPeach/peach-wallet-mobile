<h1 align="center">
  <img src="docs/peach_logo.png" alt="peach logo" />
</h1>

Peach wallet is a free mobile application for iOS and Android devices that allows making instant bitcoin transactions on the Lightning Network. It simplifies the process of making micro payments, which are processed seamlessly thanks to user-friendly application and built-in payment server solution.

### Technical details

The Peach Wallet is a **non-custodial** Lightning Network wallet that is designed for management of a remote **lnd** node.

GUI of the Peach Wallet is implemented with [ReactNative](https://github.com/facebook/react-native).

### Before using the wallet

:warning: Before creating a wallet account, you need to have your own LND running. If you don’t have it yet, you can deploy it by following our step by step instructions on [how to deploy LND to Google Cloud](https://github.com/LightningPeach/lnd-gc-deploy/blob/master/README.md).

:construction: Please be aware that this is a Beta version and development of the Peach Wallet is still in progress. It means that different issues can occur during the wallet use. Using real coins may be risky and may lead to loss of funds.

### Common features

The Peach Wallet supports the following features, which have already become common for existing Lightning Network wallets:

- Sending & receiving payments within the Lightning Network using a payment request.
- Sending & receiving payments via on-chain transactions on the Bitcoin blockchain.
- Transaction history. Details on payments that are sent and received with your wallet account are kept in history section, so you can always have access to them when it is needed.
- Payment request. You can generate kind of invoice and send it to another person to pay you according to provided payment request.
- Custom channel opening. You can create custom channel by specifying Lightning ID and host IP of a peer.

### Unique features

- Sending & receiving payments within the Lightning Network using Lightning ID. Works only in between Peach Wallet users and doesn't require a payment invoice.
- Stream payments between Peach Wallet users. Stream payments can be useful in cases when per second charges are more appropriate than regular payments (for example, voice with per second charge or online streaming services). Works only in between Peach users.
- Contacts. With the help of the Contacts tab you can specify clear and convenient contact names, which is very useful as later you can select them on the Lightning Payment page removing the need to manually keep track of a recipient's Lightning ID.

### Installation

You can [install the wallet from source](docs/installation.md).

### Contribute

If you would like to contribute to the project please reach out and we'll get you started.

You can read the Contributing guide [here](CONTRIBUTING.md).

### Contacts

Should you have any questions or suggestions, please do not hesitate to contact us:

Email: hello@lightningpeach.com

[Slack](https://join.slack.com/t/lightningpeach/shared_invite/enQtMzk2MTA1NjYyODQ4LTU2ZDYwMjZkYWNiMDhlOWIzN2RmNGE1MGE4Nzk2Yzk4YzU5MWJmMWJmMmYxZjA5N2MzNDI0YzgyZDYwMDc0YTg)

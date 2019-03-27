export default {
  // Functions return fixtures
  setHeaders: () => {},
  setBaseUrl: () => {},
  setTLS: () => {},
  currentUsdPerBtcRate: () => ({
    ok: true,
    data: require('../Fixtures/usdPerBtcRate.json'),
  }),
  newBitcoinAddress: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        address: '2N2x8VkMx2pGLkWdkkMcfJ3v6BPWvCSXju9',
      }),
    },
  }),
  getInfo: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify(require('../Fixtures/getInfo.json')),
    },
  }),
  getChannelsBalance: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        balance: '999817',
      }),
    },
  }),
  getBlockchainBalance: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        total_balance: '128999824',
        confirmed_balance: '128999824',
      }),
    },
  }),
  getTransactions: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        transactions: [
          {
            tx_hash: 'db9352f92ea27a12f5bb35fd391dedb6139908c9627ebd905bc802b16d9136b6',
            amount: '130000000',
            num_confirmations: 28638,
            block_hash: '000000000000de8ff1189f79defcac9241f7388f0c70df188627381940162eb2',
            block_height: 1326494,
            time_stamp: '1530111453',
            dest_addresses: [
              'mt6DjDAKX6cwTnu36YnbwGTXMdxCUsmEYe',
              '2NGQLUNsMw8VNiaJ9b5dyW3w827JcnpD5G5',
            ],
          },
        ],
      }),
    },
  }),
  getInvoices: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        invoices: [
          {
            r_preimage: 'Vq7QWF9CgW1vjxq2pBdAJm14v7CIiBFKSfs1YrYicZg=',
            r_hash: '8LMox3YQ4uDQY1T8rhpS4U7ko6+yHK8cKOJKIdW3zuI=',
            value: '1000',
            creation_date: '1530111356',
            payment_request:
              'lntb10u1pdn8ftupp57zej33mkzr3wp5rr2n72uxjju98wfga0kgw278pguf9zr4dhem3qdqqcqzysr4kg5kwgrp3ahzxe0qlugjlhssvs4e57xq4js8ylrtmngup4sraxfhqsae644z5saf920l5fv8x46hg3m640e8rqrap2pjp3arawruspmemct3',
            expiry: '3600',
            cltv_expiry: '144',
          },
        ],
      }),
    },
  }),
  getPayments: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({}),
    },
  }),
  getChannels: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        channels: [
          {
            name: '11',
            active: true,
            remote_pubkey: '034ec2c016fcefd8cbbc116c7a7d3fa7c7756e5aae0866f7c43f8c8b8bd49af52d',
            channel_point: 'bdbb1833ac603052f2071bedaf275c7bae8f90de6627ca10307fe7e5bd3d0e6a:1',
            chan_id: 1457766600966930433,
            capacity: 2500000,
            local_balance: 2250000,
            remote_balance: 231900,
            commit_fee: 18100,
            commit_weight: 724,
            fee_per_kw: 25000,
            unsettled_balance: 0,
            total_satoshis_sent: 0,
            total_satoshis_received: 2250000,
            num_updates: 458,
            pending_htlcs: [],
            csv_delay: 300,
            private: false,
          },
          {
            name: '1',
            active: false,
            remote_pubkey: '03605d0a5a5e78b20fe19c98d3e69d3fab3de948e14b1754544ba58aa09554359f',
            channel_point: 'aad01bfd5bcc2e3bfe1a70574992e993072715aa2e5e6797f4074b52901e8990:0',
            chan_id: 1453142055060832256,
            capacity: 1000000,
            local_balance: 100000,
            remote_balance: 890950,
            commit_fee: 9050,
            commit_weight: 724,
            fee_per_kw: 12500,
            unsettled_balance: 0,
            total_satoshis_sent: 0,
            total_satoshis_received: 100000,
            num_updates: 16,
            pending_htlcs: [],
            csv_delay: 144,
            private: false,
          },
        ],
      }),
    },
  }),
  getPendingChannels: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        total_limbo_balance: 0,
        pending_open_channels: [
          {
            channel: {
              name: '2',
              remote_node_pub: '037d1fd4e02b2c5e7e32ee2247db282b657fa71b623c8a9119eca0c62e94c2baec',
              channel_point: '3d05a0f60a2fd589bfd0fd4172cc8cb8de13c8ad3265c0af2d501eff8d638e2b:0',
              capacity: 100000,
              local_balance: 90950,
              remote_balance: 0,
            },
            confirmation_height: 0,
            commit_fee: 9050,
            commit_weight: 600,
            fee_per_kw: 12500,
          },
          {
            channel: {
              name: '3',
              remote_node_pub: '1',
              channel_point: '1',
              capacity: 100000,
              local_balance: 90950,
              remote_balance: 0,
            },
            confirmation_height: 0,
            commit_fee: 9050,
            commit_weight: 600,
            fee_per_kw: 12500,
          },
        ],
        pending_closing_channels: [],
        pending_force_closing_channels: [],
        waiting_close_channels: [],
      }),
    },
  }),
  closeChannel: () => ({
    response: {
      statusText: 'OK',
      status: 200,
    },
  }),
  getPeers: () => ({}),
  connectPeer: () => ({}),
  decodePayment: () => ({
    response: {
      statusText: 'OK',
      status: 200,
    },
  }),
  signMessage: () => ({
    response: {
      statusText: 'OK',
      status: 200,
    },
  }),
  addInvoice: () => ({}),
  createChannel: () => ({}),
  sendLightningPayment: () => ({}),
  sendCoins: () => ({}),
  getFeeRate: () => ({
    response: {
      statusText: 'OK',
      status: 200,
      bodyString: JSON.stringify({
        fee_sat: '68587',
        feerate_sat_per_kw: '483010',
      }),
    },
  }),
};

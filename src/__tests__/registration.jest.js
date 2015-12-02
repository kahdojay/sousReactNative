jest.dontMock('ddp-client')

import { DDP } from '../resources/apiConfig'
import ddpClient from '../utilities/ddpClient'

describe('registration', () => {
  it('can connect', () => {
    const mockFn = jest.genMockFunction().mockImplementation((msg) => {
      var log = JSON.parse(msg);
      if (log.hasOwnProperty('fields')){
        // console.log("MAIN DDP WITH FIELDS MSG", log);
        var data = log.fields;
        data.id = log.id;
        switch(log.collection){
          case DDP.SUBSCRIBE_LIST.RESTRICTED.collection:
            console.log(data)
            expect(data).toEqual({

            });
            break;
          default:
            break;
        }
      }
    })
    ddpClient.on('messages', mockFn);
    ddpClient.subscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel);
    ddpClient.call('sendSMSCode', ['5623105753']);
  });
});

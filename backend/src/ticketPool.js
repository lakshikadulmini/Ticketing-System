import { Mutex } from 'async-mutex';

export class TicketPool {
  constructor() {
    this.tickets = [];
    this.totalTickets = 0;
    this.maxCapacity = 0;
    this.mutex = new Mutex();
  }
  
  configure(totalTickets, maxCapacity) {
    this.totalTickets = totalTickets;
    this.maxCapacity = maxCapacity;
  }
  
  async addTickets(count) {
    const release = await this.mutex.acquire();
    try{
      if (this.tickets.length + count <= this.maxCapacity) {
        for (let i = 0; i < count; i++) {
          this.tickets.push({
            id: Date.now() + i,
            status: 'available'
          });
        }
        return true;
      }
      return false;
    }finally{
      release();
    }
    }
    
  
 async removeTicket(priority = false) {
  const release = await this.mutex.acquire();
  try{
    if (this.tickets.length > 0) {
      return this.tickets.shift();
    }
    return null;
  }finally{
    release();
  }
}
  
  getAvailableCount() {
    return this.tickets.length;
  }

}
  
    
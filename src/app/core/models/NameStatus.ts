export class NameStatus{

   private asociado : string  = 'ASOCIADO';
   private ingreso : string = "INGRESO";
   private cotizacion : string = "COTIZACION";
   private rechazado : string = "RECHAZADO";


   public getName(id : number) : string{
     
      switch(id){
          case 1: return this.asociado;
          case 2: return this.ingreso;
          case 3: return this.cotizacion;
          case 4: return this.rechazado;
      }


   }







}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RulebaseService {

  extraerInformacion(objeto: any) {
    const miembros = objeto.members || [];
    const resultado: any[] = [];

    miembros.forEach((miembro: any) => {
      const nombre = miembro.name || 'Nombre no disponible';
      const tipo = miembro.type || 'Tipo no disponible';
      let infoObjeto: any = {};
      infoObjeto.nombre = nombre;
      infoObjeto.tipo = tipo;
      if (miembro.type === 'host') {
        const direccionIP =
          miembro['ipv4-address'] || 'Dirección IP no disponible';
        infoObjeto = { ...infoObjeto, direccionIP };
      } else if (miembro.type === 'network') {
        const direccionIP = miembro['subnet4'] || 'Dirección IP no disponible';
        const mascara = miembro['mask-length4'] || 'Máscara no disponible';
        const nombreRed = `Net_${direccionIP}-${mascara}`;
        infoObjeto = { ...infoObjeto, direccionIP, mascara, nombreRed };
      } else if (miembro.type === 'dns-domain') {
        const nombreSinPunto = nombre.substring(1);
        infoObjeto = { ...infoObjeto, nombreSinPunto };
      }

      const comando = this.generarComando(infoObjeto);
      infoObjeto = { ...infoObjeto, comando };

      resultado.push(infoObjeto);
    });

    const nombresUtilizados = resultado.map(
      (objeto) => objeto.nombreRed || objeto.nombreSinPunto || objeto.nombre
    );
    const nombreDelGrupo = objeto.name || 'Nombre_del_grupo_no_disponible';
    const comandoAddressGroup = `set address-group ${nombreDelGrupo} static [ ${nombresUtilizados.join(
      ' '
    )} ]`;

    return { resultado, comandoAddressGroup };
  }

  generarComando(objeto: any) {
    const nombre = objeto.nombre || 'Nombre_no_disponible';
    const tipo = objeto.tipo || 'Tipo_no_disponible';
    let comando = '';

    if (tipo === 'host') {
      const direccionIP = objeto.direccionIP || 'IP_no_disponible';
      comando = `set address ${nombre} ip-netmask ${direccionIP}`;
    } else if (tipo === 'network') {
      const direccionIP = objeto.direccionIP || 'Direccion_IP_no_disponible';
      const mascara = objeto.mascara || 'Mascara_no_disponible';
      const nombreRed = objeto.nombreRed || 'Nombre_Red_no_disponible';
      comando = `set address ${nombreRed} ip-netmask ${direccionIP}/${mascara}`;
    } else if (tipo === 'dns-domain') {
      const nombreSinPunto =
        objeto.nombreSinPunto || 'Nombre_Sin_Punto_no_disponible';
      comando = `set address ${nombreSinPunto} fqdn ${nombreSinPunto}`;
    }
    return comando;
  }

  getCommands(objects: any) {
    let commands: any[] = [];
    console.log('COMANDOS => ', objects);
    objects.resultado.forEach((x: any) => {
      commands.push(x.comando);
    });
    console.log('DESPUES DE COMANDOS => ');

    return commands;
  }

  getServiceCommands(objects: any) {
    let commands: any[] = [];
    objects.resultado.forEach((x: any) => {
      commands.push(x.comando);
    });

    return commands;
  }

  extraerInfoServicio(objeto: any) {
    const miembros = objeto.members || [];
    const resultado: any[] = [];
    console.log(objeto);

    miembros.forEach((miembro: any) => {
      const nombre = miembro.name || 'Nombre no disponible';
      const tipo = miembro.type || 'Tipo no disponible';
      const puerto = miembro.port || 'Puerto no disponible';
      const infoObjeto = { nombre, tipo, puerto };
      const comando = this.generarComandoServicio(infoObjeto);
      resultado.push({ ...infoObjeto, comando });
    });

    const nombresUtilizados = resultado.map(
      (objeto) => objeto.nombreRed || objeto.nombreSinPunto || objeto.nombre
    );

    const nombreDelGrupo = objeto.name || 'Nombre_del_grupo_no_disponible';
    const comandoAddressGroup = `set service-group ${nombreDelGrupo} members [ ${nombresUtilizados.join(
      ' '
    )} ]`;

    return { resultado, comandoAddressGroup };
  }

  generarComandoServicio(objeto: any) {
    const nombre = objeto.nombre || 'Nombre_no_disponible';
    let tipo = objeto.tipo || 'Tipo_no_disponible';
    const puerto = objeto.puerto || 'Puerto_no_disponible';

    if (tipo === 'service-tcp') {
      tipo = 'tcp';
    }

    if (tipo === 'service-udp') {
      tipo = 'udp';
    }

    return `set service ${nombre} protocol ${tipo} port ${puerto}`;
  }

  generarComandoGrupoServicios(objeto: any) {
    const nombre = objeto.name || 'Nombre_del_grupo_no_disponible';
    const miembros = objeto.members || [];
    const miembrosComando = miembros
      .map((miembro: any) => miembro.name)
      .join(' ');

    return `set service-group ${nombre} members [ ${miembrosComando} ];`;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RulebaseService } from 'src/app/services/rulebase.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-rulebase-cp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule ],
  templateUrl: './rulebase-cp.component.html',
  styleUrl: './rulebase-cp.component.scss'
})
export class RulebaseCpComponent {
  areaForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
  });
  jsonInput: string = ''; // Variable para almacenar el JSON de entradañ
  resultado: any;

  result: UntypedFormControl = new UntypedFormControl('');
  resultGroup: UntypedFormControl = new UntypedFormControl('');

  constructor(private objetoService: RulebaseService) {}

  ngOnInit() {}

  // Función para procesar la entrada y generar resultados
  procesarEntrada() {
    try {
      const objetoEntrada = JSON.parse(this.areaForm.controls['name'].value);
      console.log('Hasta aqui');
      const tipoGrupo = objetoEntrada.type || 'Tipo_no_disponible';

      if (tipoGrupo === 'service-group') {
        console.log(objetoEntrada);
        // Extraer información y generar comandos
        this.resultado = {
          informacion: this.objetoService.extraerInfoServicio(objetoEntrada),
          comandos: this.objetoService.generarComandoServicio(objetoEntrada),
        };
        let commands = this.objetoService.getServiceCommands(
          this.resultado.informacion
        );
        console.log('RESULTADO =>', this.resultado);
        this.result.setValue(commands.join('\n'));
        console.log(this.resultado);
        this.resultGroup.setValue(
          this.resultado.informacion.comandoAddressGroup
        );
      } else {
        // Extraer información y generar comandos
        this.resultado = {
          informacion: this.objetoService.extraerInformacion(objetoEntrada),
          comandos: this.objetoService.generarComando(objetoEntrada),
        };
        console.log('SERVICE GROUP => ', this.resultado);
        let commands = this.objetoService.getCommands(
          this.resultado.informacion
        );
        this.result.setValue(commands.join('\n'));
        console.log(this.resultado);
        this.resultGroup.setValue(
          this.resultado.informacion.comandoAddressGroup
        );
      }
    } catch (error) {
      console.error('Error al analizar el JSON:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  }
}

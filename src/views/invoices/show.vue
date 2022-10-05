<template>
	<v-container>
		<!-- invoice -->
		<v-row>
			<v-col cols="9">
				<v-card tile class="p-3">
					<v-row class="invoice-printable-area">
						<v-col cols="4">
							<h6>Bill From</h6>
							<div>
								<span>Eons Enterprise</span>
							</div>
							<div>
								<span><i class="fa fa-phone-square"></i>&ensp;0244547665</span>
							</div>
							<div>
								<span
									><i class="fa fa-envelope-square"></i
									>&ensp;i.agyeiduku@gmail.com</span
								>
							</div>
						</v-col>
						<v-col cols="4">
							<h6>Bill To</h6>
							<div>
								<span>Unknown</span>
							</div>
							<div>
								<span
									><i class="fa fa-address-card">&nbsp;</i>Mama Stone's Shop
								</span>
							</div>
							<div>
								<span>Ahodwo - Kumasi</span>
							</div>
							<div>
								<span
									><i class="fa fa-phone-square" aria-hidden="true"></i>&ensp;
									0209480433</span
								>
							</div>
						</v-col>
						<v-col>
							<br />
							<div>
								<span>Date: {{ invoice.date }}</span>
							</div>
							<div>
								<span>Invoice# {{ invoice.id }}</span>
							</div>
						</v-col>
					</v-row>

					<v-divider></v-divider>

					<v-row>
						<v-col cols="1">#</v-col>
						<v-col cols="7">Item Description</v-col>
						<v-col cols="2">Quantity</v-col>
						<v-col cols="2">Unit Price</v-col>
					</v-row>
					<v-divider></v-divider>

					<v-row v-for="(item, index) in invoice.invoice_items" :key="item.id">
						<v-col cols="1">{{ index + 1 }}</v-col>
						<v-col cols="7">{{ item.description }}</v-col>
						<v-col cols="2">{{ item.quantity }}</v-col>
						<v-col cols="2">{{ item.unit_cost | currency('GH¢') }}</v-col>
					</v-row>

					<v-divider></v-divider>

					<v-row>
						<v-col cols="8"> Qrcode here </v-col>
						<v-col cols="4">
							<p class="h5">Total:{{ invoice.total | currency('GH¢') }}</p>
						</v-col>
					</v-row>
				</v-card>
			</v-col>

			<!-- buttons -->
			<v-col cols="3">
				<v-card tile class="p-3 pl-3">
					<div class="ma-2">
						<v-btn block tile color="teal" large dark>
							<v-icon small>print</v-icon>
							<span>Print</span>
						</v-btn>
					</div>
					<div class="ma-2">
						<v-btn block tile color="#1565C0" large dark>
							<v-icon small>cloud</v-icon>
							<span>Save</span>
						</v-btn>
					</div>
					<div class="ma-2">
						<v-btn tile block depressed large>
							<v-icon small>edit</v-icon>
							<span color="primary">Edit</span>
						</v-btn>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	// import { ipcRenderer } from 'electron';
	export default {
		data() {
			return {
				invoice: {},
			};
		},
		created() {
			this.getInvoice();
		},

		methods: {
			getInvoice() {
				// let id = this.$route.params.id;
			},
		},
	};
</script>

<style></style>

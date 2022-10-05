<template>
	<v-data-table
		:headers="headers"
		:items="invoices"
		sort-by="date"
		class="elevation-1"
	>
		<template v-slot:top>
			<v-toolbar flat color="teal" dark>
				<v-toolbar-title>GENERATED INVOICES</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
				<div max-width="500px">
					<v-btn color="white" class="mb-2 teal--text" @click="redirect()">
						New Invoice
					</v-btn>
				</div>
			</v-toolbar>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-icon small class="mr-2" @click="editItem(item.id)">
				mdi-pencil
			</v-icon>
			<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
		</template>

		<!-- INVOICE_ID SLOT -->
		<template v-slot:[`item.invoice_id`]="{ item }">
			<span>{{ `INV-${item.id + 1000}` }}</span>
		</template>
		<template v-slot:item.total="{ item }">
			<span>{{ item.total | currency('GH¢') }}</span>
		</template>

		<template v-slot:no-data>
			<v-btn color="primary" @click="loadInvoices()"> Reset </v-btn>
		</template>
	</v-data-table>
</template>

<script>
	// import { ipcRenderer } from 'electron';
	export default {
		data: () => ({
			headers: [
				{
					text: '#',
					align: 'start',
					sortable: true,
					value: 'id',
				},
				{ text: 'Invoice ID', value: 'invoice_id', sortable: false },
				{ text: 'Total', value: 'total', sortable: true },
				{ text: 'Date', value: 'date' },
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			invoices: [
				{
					invoice_id: 'inv-001',
					total: 200,
					date: '02-09-2022',
				},
			],
		}),

		created() {
			this.loadInvoices();
		},

		methods: {
			loadInvoices() {
				return this.invoices;
			},
			redirect() {
				this.$router.push('/');
			},
			editItem(id) {
				this.$router.push(`/invoices/${id}`);
			},
		},
	};
</script>

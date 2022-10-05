<template>
	<v-data-table
		:fixed-header="true"
		:headers="headers"
		:search="search"
		:items="categories"
		sort-by="calories"
		class="elevation-1 mytable"
	>
		<template v-slot:top>
			<v-toolbar flat color="teal" dark>
				<v-toolbar-title>CATEGORIES</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>

				<v-text-field
					v-model="search"
					outlined
					dense
					append-icon="mdi-magnify"
					label="Search"
					single-line
					hide-details
				></v-text-field>
				<v-spacer></v-spacer>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-dialog v-model="dialog" max-width="500px">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="white"
							class="mb-2 teal--text"
							v-bind="attrs"
							v-on="on"
						>
							<span class="font-weight-bold">+</span> New Category
						</v-btn>
					</template>
					<v-card>
						<v-card-title>
							<span class="headline">{{ formTitle }}</span>
						</v-card-title>

						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field
											v-model="editedItem.name"
											outlined
											dense
											label="Category name"
											@input="$v.editedItem.name.$touch()"
											@blur="$v.editedItem.name.$touch()"
											:error-messages="nameErrors"
										>
										</v-text-field>
									</v-col>
									<v-col cols="12">
										<v-textarea
											v-model="editedItem.description"
											dense
											rows="2"
											outlined
											label="Description"
											@input="$v.editedItem.description.$touch()"
											@blur="$v.editedItem.description.$touch()"
											:error-messages="descriptionErrors"
										>
										</v-textarea>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="red darken-1 white--text" @click="close">
								Cancel
							</v-btn>
							<v-btn
								color="teal darken-1 white--text"
								:disabled="$v.$invalid"
								@click="save"
							>
								Save
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
				<v-dialog v-model="dialogDelete" max-width="500px">
					<v-card>
						<v-card-title class="headline"
							>Are you sure you want to delete this item?</v-card-title
						>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="red darken-1 white--text" @click="closeDelete"
								>No</v-btn
							>
							<v-btn
								color="teal darken-2 white--text"
								@click="deleteItemConfirm"
								>Yes</v-btn
							>
							<v-spacer></v-spacer>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
		</template>
		<template v-slot:[`item.actions`]="{ item }">
			<v-icon
				id="editbutton"
				small
				class="mr-2"
				color="teal editbutton"
				alt-labels="Edit"
				@click="editItem(item)"
			>
				mdi-pencil
			</v-icon>
			<v-icon id="deletebutton" small color="red" @click="deleteItem(item)">
				mdi-delete
			</v-icon>
		</template>
		<template v-slot:no-data>
			<v-btn color="teal" @click="loadCategories"> Reset </v-btn>
		</template>
	</v-data-table>
</template>

<script>
	import { minLength, required } from 'vuelidate/lib/validators';

	export default {
		data: () => ({
			dialog: false,
			dialogDelete: false,
			search: '',
			headers: [
				{
					text: 'Category Name',
					align: 'start',
					sortable: true,
					value: 'name',
				},
				{ text: 'Description', value: 'description' },
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			categories: [
				{
					name: 'soaps',
					description: 'All Type of soaps and detergents',
				},
				{
					name: 'cereals',
					description: 'All Type of foreign and local rice',
				},
			],
			editedIndex: -1,
			editedItem: {
				name: '',
				Description: '',
			},
			defaultItem: {
				name: '',
				Description: '',
			},
		}),

		computed: {
			formTitle() {
				return this.editedIndex === -1 ? 'New Category' : 'Edit Category';
			},
			nameErrors() {
				const errors = [];
				if (!this.$v.editedItem.name.$dirty) return errors;
				!this.$v.editedItem.name.required &&
					errors.push('Category name is required*');
				!this.$v.editedItem.name.minLength &&
					errors.push('Category name must be atleast 3 characters*');
				!this.$v.editedItem.name.uniqueName &&
					errors.push('Category name already Exist*');
				return errors;
			},
			descriptionErrors() {
				const errors = [];
				if (!this.$v.editedItem.description.$dirty) return errors;
				!this.$v.editedItem.description.required &&
					errors.push('Category description is required');
				!this.$v.editedItem.description.minLength &&
					errors.push('Category description must be atleast 3 characters*');
				return errors;
			},
		},

		watch: {
			dialog(val) {
				val || this.close();
			},
			dialogDelete(val) {
				val || this.closeDelete();
			},
		},

		// VALIDATION OF FORM INPUTS
		validations: {
			editedItem: {
				name: {
					required,
					minLength: minLength(3),
					async uniqueName(value) {
						if (value == '') return true;

						const categories = await this.categories;
						const name_alreadyExist = categories.find(
							(category) => category.name.toLowerCase() === value.toLowerCase()
						);
						if (name_alreadyExist) {
							return false;
						}
						return true;
					},
				},
				description: {
					required,
					minLength: minLength(3),
				},
			},
		},

		created() {
			this.loadCategories();
		},

		methods: {
			loadCategories() {
				return this.categories;
			},

			editItem(item) {
				this.editedIndex = this.categories.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialog = true;
			},

			deleteItem(item) {
				this.editedIndex = this.categories.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialogDelete = true;
			},

			deleteItemConfirm() {
				this.categories.splice(this.editedIndex, 1);
				this.closeDelete();
			},

			close() {
				this.dialog = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},

			closeDelete() {
				this.dialogDelete = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},

			save() {
				if (this.editedIndex > -1) {
					Object.assign(this.categories[this.editedIndex], this.editedItem);
					// ipcRenderer.send('categories:update', this.editedItem);
				} else {
					this.$v.$touch();
					if (!this.$v.$invalid) {
						// ipcRenderer.send('categories:add', this.editedItem);
						this.loadCategories();
						// this.categories.push(this.editedItem)
					}
				}
				this.close();
			},
		},
	};
</script>

<style>
	.flex-table {
		height: 50px;
	}
	.flex-table.row:nth-of-type(2n) {
		background: rgb(238, 238, 238);
	}

	.flex-table.v-text-field input {
		padding: 2px 0 2px 0px;
	}

	/* .mytable table tr {
    background-color: lightgoldenrodyellow;
    border-bottom: none;
  } */

	.mytable tbody tr:nth-of-type(odd) {
		background-color: rgba(0, 0, 0, 0.05);
	}
	/* tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
  }
  table thead{
    font-weight: bolder;
    background-color: black;
  } */
</style>
